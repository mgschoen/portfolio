export default `<template>
  <div>
    <b-row>
      <b-col>
        <div id="mapWrapper"></div>
      </b-col>
    </b-row>
    <b-row class="mapControls" align-h="center">
      <b-col cols="auto" sm="auto" class="controlsCol">
        <div class="controlsFrame">
          <switches v-model="showGrid"
                    theme="fsd"
                    label="Show Grid"></switches>
        </div>
      </b-col>
      <b-col cols="auto" sm="auto" class="controlsCol">
        <div class="controlsFrame">
          <label>Zoom Level</label>
          <code>{{zoomLevel}}</code>
        </div>
      </b-col>
      <b-col cols="auto" sm="auto" class="controlsCol">
        <div class="controlsFrame">
          <switches v-model="focusVehicle"
                    theme="fsd"
                    label="Focus Vehicle"></switches>
        </div>
      </b-col>
      <b-col cols="auto" sm="auto" class="controlsCol coords">
        <div class="controlsFrame">
          <label>Cursor Position</label>
          <code>{{cursorCoordsString}}</code>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
// Libraries
import { mapState } from 'vuex'
import Konva from 'konva'
import Switches from 'vue-switches'

// Custom imports
import { meterToPixels, pixelToMeters, precisionRound } from '@/shared/util'
import ViewZoom from './mixins/view-zoom'
import ViewAnimation from './mixins/view-animation'
import ViewportUtil from './mixins/viewport-util'

export default {
  name: 'Map',
  data () {
    return {
      // program logic internals
      lastKnownVehiclePosition: { x: 0, y: 0 },

      // render objects
      stage: null,

      cursorLayer: null,
      shapeCursorTooltip: null,

      gridLayer: null,
      shapeGrid: null,
      shapeXAxis: null,
      shapeYAxis: null,
      xAxisLabels: {},
      yAxisLabels: {},

      vehicleLayer: null,
      shapeVehicle: null,

      basecaseLayer: null,
      basecaseShapes: [],

      clusterLayer: null,
      clusterShapes: {},
      clusterHashes: {},

      observationsLayer: null,
      observationsShapes: [],

      trajectoryLayer: null,
      shapeTrajectory: null,
      lastKnownTrajectoryHash: 0,

      // animations
      animationStage: null,
      animationVehicle: null,
      animationTrack: null,
      animationMiddlePath: null,

      // view parameters
      zoomStep: 1.1,
      lastTouchDistance: null,
      minZoomScale: 0.15,
      maxZoomScale: 5.0,
      zoomLevel: 1.00,
      canvasCursorX: null,
      canvasCursorY: null,
      realWorldCursorX: null,
      realWorldCursorY: null,

      // view controls
      showVehicle: true,
      showTrack: true,
      showMiddlePath: true,
      showGrid: true,
      focusVehicle: true
    }
  },
  computed: {
    cursorCoordsString: function () {
      return (this.realWorldCursorX && this.realWorldCursorY)
        ? \`
$ { this.realWorldCursorX }, $ { this.realWorldCursorY }
\`
        : '-'
    },
    ...mapState([
      'liveStats',
      'replay',
      'viewDataSource'
    ])
  },
  watch: {
    focusVehicle: function (newValue) {
      if (this.animationStage) {
        if (newValue) {
          this.animationStage.start()
        } else {
          this.animationStage.stop()
        }
      }
    },
    showGrid: function (newValue) {
      if (this.gridLayer) {
        if (newValue) {
          this.gridLayer.show()
        } else {
          this.gridLayer.hide()
        }
      }
    }
  },
  mounted () {
    // Initialise Konva app
    let canvas = this.$el.querySelector('#mapWrapper')
    this.stage = new Konva.Stage({
      container: 'mapWrapper',
      draggable: true,
      width: canvas.offsetWidth,
      height: 500
    })

    // create layers
    this.gridLayer = new Konva.Layer()
    this.vehicleLayer = new Konva.Layer({scaleY: -1})
    this.basecaseLayer = new Konva.Layer({scaleY: -1})
    this.clusterLayer = new Konva.Layer({scaleY: -1})
    this.observationsLayer = new Konva.Layer({scaleY: -1})
    this.trajectoryLayer = new Konva.Layer({scaleY: -1})
    this.stage.add(this.gridLayer)
    this.stage.add(this.vehicleLayer)
    this.stage.add(this.basecaseLayer)
    this.stage.add(this.clusterLayer)
    this.stage.add(this.observationsLayer)
    this.stage.add(this.trajectoryLayer)

    if (!this.showGrid) {
      this.gridLayer.hide()
    }

    // draw coordinate axes
    this.shapeXAxis = new Konva.Line({
      points: [0, 2000, 0, -2000],
      stroke: 'red',
      strokeWidth: 3
    })
    this.shapeYAxis = new Konva.Line({
      points: [2000, 0, -2000, 0],
      stroke: 'green',
      strokeWidth: 3
    })
    this.gridLayer.add(this.shapeXAxis, this.shapeYAxis)

    // draw grid
    let gridImage = new Image()
    gridImage.onload = function () {
      this.shapeGrid = new Konva.Rect({
        fillPatternImage: gridImage,
        fillPatternRepeat: 'repeat',
        height: 500,
        width: canvas.offsetWidth
      })
      this.gridLayer.add(this.shapeGrid)
    }.bind(this)
    gridImage.src = '/static/grid.png'

    // draw vehicle
    Konva.Image.fromURL('/static/pwd.png', image => {
      image.size({
        width: meterToPixels(2.925),
        height: meterToPixels(1.395)
      })
      image.offsetX(image.width() / 2)
      image.offsetY(image.height() / 2)
      image.position({
        x: meterToPixels(this.liveStats.vehicleX),
        y: meterToPixels(this.liveStats.vehicleY)
      })
      this.shapeVehicle = image
      this.vehicleLayer.add(image)
      this.animateStage()
    })

    // draw trajectory
    this.shapeTrajectory = new Konva.Line({
      points: [],
      stroke: 'red',
      strokeWidth: 4
    })
    this.trajectoryLayer.add(this.shapeTrajectory)

    // add animations
    this.animationVehicle = new Konva.Animation(this.drive, [
      this.vehicleLayer,
      this.basecaseLayer,
      this.clusterLayer,
      this.observationsLayer,
      this.trajectoryLayer
    ])
    this.animationStage = new Konva.Animation(this.animateStage)

    // start animations
    this.animationVehicle.start()
    if (this.focusVehicle) {
      this.animationStage.start()
    }

    // initialise redraw on stage drag
    this.stage.on('dragmove', _ => {
      if (this.showGrid) {
        this.redrawGrid()
      }
    })

    // initialise crosshair
    this.stage.on('mousemove', this.updateCanvasCursor)
    this.stage.on('mouseleave', this.resetCanvasCursor)

    // initialise zoom
    this.stage.attrs.container.addEventListener('mousewheel', this.performZoom.bind(this))
    this.stage.attrs.container.addEventListener('wheel', this.performZoom.bind(this))
    this.stage.attrs.container.addEventListener('touchmove', this.performZoomTouch)
    this.stage.attrs.container.addEventListener('touchend', _ => {
      this.lastTouchDistance = null
    })

    // initialise canvas resizing
    window.addEventListener('load', this.resizeCanvas.bind(this))
    window.addEventListener('resize', this.resizeCanvas.bind(this))
  },
  methods: {
    resizeCanvas () {
      this.stage.width(this.$el.querySelector('#mapWrapper').offsetWidth)
    },
    updateCanvasCursor (event) {
      this.canvasCursorX = event.evt.layerX
      this.canvasCursorY = event.evt.layerY
      this.updateRealWorldCursor()
    },
    resetCanvasCursor () {
      this.canvasCursorX = null
      this.canvasCursorY = null
      this.updateRealWorldCursor()
    },
    updateRealWorldCursor () {
      if (this.canvasCursorX !== null && this.canvasCursorY !== null) {
        let viewportDimensions = this.getVisibleWorldDimensions()
        let absolutePixelX = viewportDimensions.x + (this.canvasCursorX / this.stage.scaleX())
        let absolutePixelY = viewportDimensions.y + (this.canvasCursorY / this.stage.scaleY())
        this.realWorldCursorX = precisionRound(pixelToMeters(absolutePixelX), 1)
        this.realWorldCursorY = precisionRound(pixelToMeters(-absolutePixelY), 1)
      } else {
        this.canvasCursorX = null
        this.canvasCursorY = null
        this.realWorldCursorX = null
        this.realWorldCursorY = null
      }
    },
    ...ViewZoom,
    ...ViewAnimation,
    ...ViewportUtil
  },
  components: {
    Switches
  }
}
</script>

<style>
#mapWrapper {
  background: var(--app-background-color);
  height: 500px;
  margin: 20px auto 10px;
  width: 100%;
}
#mapWrapper:hover {
  cursor: crosshair;
}
.mapControls {
  margin-bottom: 10px;
}

.controlsCol {
  padding-left: 7.5px;
  padding-right: 7.5px;
  margin-bottom: 10px;
}
.controlsCol:last-of-type {
  padding-right: 15px;
}
.controlsCol:first-of-type {
  padding-left: 15px;
}

.mapControls .controlsFrame {
  border: 1px solid lightgrey;
  border-radius: 3px;
  padding: 5px 10px 0;
}

.mapControls .coords .controlsFrame {
  min-width: 160px;
}

.mapControls .controlsFrame label {
  display: block;
  font-size: 10px;
  margin-bottom: 5px;
}

.mapControls .controlsFrame code {
  display: block;
  margin: -3px auto 3px;
  text-align: left;
}

.mapControls .coords .controlsFrame code {
  text-align: center;
}
</style>`;