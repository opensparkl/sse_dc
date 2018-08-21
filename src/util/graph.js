/**
 * @copyright 2017 SPARKL Limited. All Rights Reserved
 * @author <yev@sparkl.com> Yevheniy Vlasenko
 *
 * Module creates detached SVG graph representing Sparkl mix.
 */
import * as d3 from 'd3'
// eslint-disable-next-line
import { event as d3Event } from 'd3'

var NS_SVG = 'http://www.w3.org/2000/svg'
var MIN_HEIGHT = 418

var split = (str = '') => {
  return str.split(/\s+/gi).filter(v => v)
}

var range = (val, min, max) => {
  if (val < min) return min
  if (val > max) return max

  return val
}

var blurReplies = (node, skipElementId) => {
  if (node) {
    var replies = node.querySelectorAll('tr')

    if (replies) {
      for (var i = 0; i < replies.length; i++) {
        var reply = replies[i]

        if (reply.id !== skipElementId) {
          reply.style.cssText = 'opacity: 0.6;'
        }
      }
    }
  }
}

var getNodeCloneById = (id) => {
  let target = document
    .querySelector('.sparkl-node#' + id)

  if (target) {
    return target.cloneNode(true)
  } else {
    let reply = document.querySelector('tr#' + id)

    if (reply) {
      target = reply.closest('.sparkl-node').cloneNode(true)
      blurReplies(target, id)

      return target
    }
  }

  return null
}

var cleanGraphInfo = () => {
  document
    .querySelector('#graph-info')
    .innerHTML = ''
}

function Graph (parent, content, mix) {
  var graph = this
  var dragging = false

  this.WIDTH = 1000
  this.HEIGHT = MIN_HEIGHT

  this.X_DIST = 140
  this.Y_DIST = 50
  this.zoomVal = 1

  this.mode = 'move' // 'idle';
  this.dpos = { x: 0, y: 0 }
  this.parent = parent

  var $data = this.data = this.transform(content, mix)

  this.svg = d3
    .select(parent)
    .append('svg')
    .attr({
      'width': '100%',
      'height': this.HEIGHT
    })

  this.force = d3.layout.force()
    .size([this.WIDTH, this.HEIGHT])
    .charge(-60)
    .linkDistance(120)
    .nodes(d3.values(this.data.nodes))
    .links(this.data.edges)

  var background = d3.behavior.drag()
    .on('dragstart', (e) => {
      d3Event.sourceEvent.stopPropagation()
    })
    .on('drag', (event) => {
      if (graph.mode === 'move') {
        graph.dpos.x += d3Event.dx
        graph.dpos.y += d3Event.dy

        let container = graph.container[0][0]

        container.setAttribute('transform',
          `translate(${graph.dpos.x}, ${graph.dpos.y}) scale(${graph.zoomVal})`
        )
      }
    })

  var select = function (sender, d) {
    d3.select('.graph-container').classed('dragging', dragging)
    d3.select(sender).classed('graph-selected', dragging)

    d3.selectAll(`[data-target="${d.index}"]`)
      .classed('graph-target', dragging)
      .each(function (v) {
        d3.select(`#label-${v.index} .fieldset`)
          .classed('hidden', !dragging)
      })

    d3.selectAll(`[data-source="${d.index}"]`)
      .classed('graph-source', dragging)
      .each(function (v) {
        d3.select(`#label-${v.index} .fieldset`)
          .classed('hidden', !dragging)
      })
  }

  var drag = this.force.drag()
    .on('dragstart', function (d) {
      dragging = true
      select(this, d)
    })
    .on('dragend', function (d) {
      dragging = false
      select(this, d)
    })

  this.background = this.svg.append('rect')
    .attr({
      'width': this.WIDTH,
      'height': this.HEIGHT,
      'style': 'fill: none; cursor: move; pointer-events: all'
    })
    .call(background)

  this.container = this.svg.append('g')
    .attr('class', 'graph-container')

  var link = this.container.append('g')
    .attr('class', 'links')
    .selectAll('.link')
    .data(this.force.links())
    .enter()
    .append('g')
    .attr('class', 'graph-link')
    .attr('id', function (d) {
      return d.index
    })
    .attr('data-source', function (d) {
      return d.attr.from
    })
    .attr('data-target', function (d) {
      return d.attr.to
    })
    .append('svg:path')
    .attr('class', 'svg-line')
    .on('mouseenter', function (d) {
      if (!dragging) {
        this.classList.add('highlight')

        var clone = getNodeCloneById(d.request)
        if (clone) {
          blurReplies(clone, d.reply)

          document
            .querySelector('#graph-info')
            .appendChild(clone)
        }
      }
    })
    .on('mouseleave', function (d) {
      this.classList.remove('highlight')
      cleanGraphInfo()
    })

  var node = this.container.append('g')
    .attr('class', 'nodes')
    .selectAll('.node')
    .data(this.force.nodes())
    .enter()
    .append('g')
    .attr('class', 'graph-node')
    .attr('id', function (d) {
      if (d.attr.fields) {
        var array = d.attr.fields.split(/\s+/)

        d.fields = array
          .map(id => [id, mix.nodes[id].attr.name])
      }

      return d.attr.index
    })
    .call(drag)
    .on('mouseenter', function (d, a) {
      if (!dragging) {
        var leftids = getIndexes(d.attr, ['solicits', 'notifies', 'replies'])
        var rightids = getIndexes(d.attr, ['responses', 'requests', 'consumes'])

        d.sources.forEach(i => {
          var link = $data.links[i][d.index]

          if (link) {
            leftids.push(link.reply)
          }
        })

        var ids = (leftids || []).concat(rightids || [])

        ids
          .map(getNodeCloneById)
          .forEach(node => {
            if (node) {
              document
                .querySelector('#graph-info')
                .appendChild(node)
            }
          })
      }
    })
    .on('mouseleave', () => {
      cleanGraphInfo()
    })

  node
    .append('circle')
    .attr({
      'class': 'svg-circle',
      'r': 16
    })

  node
    .append('text')
    .attr({
      'text-anchor': 'middle',
      'style': 'font-size: 10px',
      'dy': 4
    })
    .text(function (d) {
      return d.attr.fields
        ? split(d.attr.fields).length
        : 0
    })

  var getIndexes = function (attr, list) {
    return split(
        list.map(name => attr[name] || '').join(' ')
      )
  }

  var labels = this.container.append('g')
    .attr('class', 'labels')
    .selectAll('.label')
    .data(this.force.links())
    .enter()
    .append(function (d) {
      if (d.attr && d.attr.reply) {
        let reply = mix.nodes[d.attr.reply]
        let request = mix.nodes[reply.__parent]

        d.reply = reply.attr.id
        d.request = request.attr.id
      }

      var reply = mix.nodes[d.reply]
      var request = mix.nodes[d.request]
      var name = request.attr.name + ' • ' + reply.attr.name

      var group = d3
        .select(document.createElementNS(NS_SVG, 'g'))
        .attr({
          'class': 'text-blob',
          'id': 'label-' + d.index
        })

      var fieldsets = group
        .append('g')
        .attr({
          'class': 'fieldset hidden'
        })

      fieldsets
          .append('text')
          .attr({
            'class': 'svg-text',
            'text-anchor': 'middle',
            'dx': 0,
            'dy': 3
          })
          .text(name)

      return group[0][0]
    })

  this.force.on('tick', function () {
    node
      .attr('transform', ({ x, y }) => `translate(${x}, ${y})`)

    labels
      .attr('transform', ({ source, target }) => {
        var x = source.x + 0.5 * (target.x - source.x)
        var y = source.y + 0.5 * (target.y - source.y)
        return `translate(${x}, ${y})`
      })

    link
      .attr('d', ({ source, target }) => {
        return `M${source.x}, ${source.y} L ${target.x}, ${target.y}`
      })
  })

  this.force.start()
}

Graph.ZOOM_MAX = 2
Graph.ZOOM_MIN = 0.2

Graph.prototype.transform = function (json, mix) {
  var graph = this
  var source = {}
  var links = {}
  var nodes = {}
  var trees = {}
  var levels = {}
  var ends = []
  var edges = []

  if (Array.isArray(json.content)) {
    json.content.forEach(parent => {
      if (parent.content) {
        source[parent.tag] = parent.content.map(v => v)
      }
    })
  }

  if (source.vertices) {
    source.vertices.forEach(v => {
      v.drag = false
      v.fixed = true
      v.sources = []
      v.targets = []
      nodes[v.attr.index] = v
    })
  }

  if (source.edges) {
    source.edges.forEach((e, i) => {
      if (!links.hasOwnProperty(e.attr.from)) {
        links[e.attr.from] = {}
      }

      edges.push(e)
      ends.push(e.attr.to)
      links[e.attr.from][e.attr.to] = e

      nodes[e.attr.from].targets.push(e.attr.to)
      nodes[e.attr.to].sources.push(e.attr.from)

      e.__id = Math.random().toString(36).replace('.', '-')
      e.index = i
      e.source = nodes[e.attr.from]
      e.target = nodes[e.attr.to]
      e.linknum = Object.keys(links[e.attr.from]).length
    })
  }

  var starts = Object.keys(nodes)
    .filter(n => ends.indexOf(parseInt(n)) === -1)

  var traverse = function (id, x, y) {
    var router = links[id] || {}
    var counter = 0
    var value = { index: id, links: [] }

    if (!levels.hasOwnProperty(x)) {
      levels[x] = 0
    }

    if (!nodes[id].hasOwnProperty('x')) {
      nodes[id].dx = x
      nodes[id].dy = y
      nodes[id].x = graph.X_DIST + graph.X_DIST * x
      nodes[id].y = 0.5 * graph.HEIGHT + levels[x] * graph.Y_DIST
      levels[x]++
    }

    for (var i in router) {
      value.links.push(traverse(i, x + 1, y + counter))
      counter++
    }

    return value
  }

  var getMax = function (values) {
    var max = 0

    for (let i in values) {
      if (values.hasOwnProperty(i) && values[i] > max) {
        max = values[i]
      }
    }

    return max
  }

  for (let j = 0; j < starts.length; j++) {
    trees[starts[j]] = traverse(starts[j], 0, 0)
  }

  for (let f in nodes) {
    if (nodes.hasOwnProperty(f)) {
      var level = levels[nodes[f].dx]
      nodes[f].y -= 0.5 * graph.Y_DIST * level
    }
  }

  var largest = getMax(levels)
  var prevHeight = graph.HEIGHT

  graph.HEIGHT = Math.max(MIN_HEIGHT, graph.Y_DIST * (largest + 2))
  var deltaHeight2 = 0.5 * (prevHeight - graph.HEIGHT) - 0.5 * graph.Y_DIST

  for (let n in nodes) {
    nodes[n].y -= deltaHeight2
  }

  for (let j in mix.nodes) {
    if (mix.nodes[j].content) {
      var array = mix.nodes[j].content
      for (var k = 0; k < array.length; k++) {
        var el = array[k]
        if (el.attr && el.attr.id) {
          el.__parent = mix.nodes[j].attr.id
          mix.nodes[el.attr.id] = el
        }
      }
    }
  }

  return {
    edges: edges,
    links: links,
    nodes: nodes,
    trees: trees,
    levels: levels
  }
}

Graph.prototype.zoom = function (zoom) {
  this.zoomVal = range(zoom, Graph.ZOOM_MIN, Graph.ZOOM_MAX)

  let svg = d3.select(this.parent).transition()
  let { dpos, zoomVal } = this

  svg.select('.graph-container')
    .attr('transform',
     `translate(${dpos.x}, ${dpos.y}) scale(${zoomVal})`)

  return zoomVal
}

Graph.prototype.zoomIn = function () {
  return this.zoom(this.zoomVal + 0.1)
}

Graph.prototype.zoomOut = function () {
  return this.zoom(this.zoomVal - 0.1)
}

export default Graph
