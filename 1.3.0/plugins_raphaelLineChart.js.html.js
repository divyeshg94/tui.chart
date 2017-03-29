ne.util.defineNamespace("fedoc.content", {});
fedoc.content["plugins_raphaelLineChart.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview Raphael line chart renderer.\n * @author NHN Ent.\n *         FE Development Team &lt;dl_javascript@nhnent.com>\n */\n\n'use strict';\n\nvar RaphaelLineBase = require('./raphaelLineTypeBase'),\n    raphaelRenderUtil = require('./raphaelRenderUtil');\n\nvar Raphael = window.Raphael,\n    ANIMATION_TIME = 700;\n\n/**\n * @classdesc RaphaelLineCharts is graph renderer for line chart.\n * @class RaphaelLineChart\n * @extends RaphaelLineTypeBase\n */\nvar RaphaelLineChart = tui.util.defineClass(RaphaelLineBase, /** @lends RaphaelLineChart.prototype */ {\n    /**\n     * Render function of line chart.\n     * @param {HTMLElement} container container\n     * @param {{groupPositions: array.&lt;array>, dimension: object, theme: object, options: object}} data render data\n     * @return {object} paper raphael paper\n     */\n    render: function(container, data) {\n        var dimension = data.dimension,\n            groupPositions = data.groupPositions,\n            theme = data.theme,\n            colors = theme.colors,\n            opacity = data.options.hasDot ? 1 : 0,\n            groupPaths = this._getLinesPath(groupPositions),\n            borderStyle = this.makeBorderStyle(theme.borderColor, opacity),\n            outDotStyle = this.makeOutDotStyle(opacity, borderStyle),\n            paper, groupLines, tooltipLine, selectionDot, groupDots;\n\n        this.paper = paper = Raphael(container, dimension.width, dimension.height);\n\n        groupLines = this._renderLines(paper, groupPaths, colors);\n        tooltipLine = this._renderTooltipLine(paper, dimension.height);\n        selectionDot = this._makeSelectionDot(paper);\n        groupDots = this._renderDots(paper, groupPositions, colors, borderStyle);\n\n        if (data.options.hasSelection) {\n            this.selectionDot = selectionDot;\n            this.selectionColor = theme.selectionColor;\n        }\n\n        this.borderStyle = borderStyle;\n        this.outDotStyle = outDotStyle;\n        this.groupPositions = groupPositions;\n        this.groupPaths = groupPaths;\n        this.groupLines = groupLines;\n        this.tooltipLine = tooltipLine;\n        this.groupDots = groupDots;\n        this.dotOpacity = opacity;\n\n        return paper;\n    },\n\n    /**\n     * Get lines path.\n     * @param {array.&lt;array.&lt;object>>} groupPositions positions\n     * @returns {array.&lt;array.&lt;string>>} paths\n     * @private\n     */\n    _getLinesPath: function(groupPositions) {\n        var groupPaths = tui.util.map(groupPositions, function(positions) {\n            var fromPos = positions[0],\n                rest = positions.slice(1);\n            return tui.util.map(rest, function(position) {\n                var result = this.makeLinePath(fromPos, position);\n                fromPos = position;\n                return result;\n            }, this);\n        }, this);\n        return groupPaths;\n    },\n\n    /**\n     * Render lines.\n     * @param {object} paper raphael paper\n     * @param {array.&lt;array.&lt;string>>} groupPaths paths\n     * @param {string[]} colors line colors\n     * @param {number} strokeWidth stroke width\n     * @returns {array.&lt;array.&lt;object>>} lines\n     * @private\n     */\n    _renderLines: function(paper, groupPaths, colors, strokeWidth) {\n        var groupLines = tui.util.map(groupPaths, function(paths, groupIndex) {\n            var color = colors[groupIndex] || 'transparent';\n            return tui.util.map(paths, function(path) {\n                return raphaelRenderUtil.renderLine(paper, path.start, color, strokeWidth);\n            }, this);\n        }, this);\n\n        return groupLines;\n    },\n\n    /**\n     * Animate.\n     * @param {function} callback callback\n     */\n    animate: function(callback) {\n        var time = ANIMATION_TIME / this.groupLines[0].length,\n            that = this,\n            startTime = 0;\n        this.renderItems(function(dot, groupIndex, index) {\n            var line, path;\n\n            if (index) {\n                line = that.groupLines[groupIndex][index - 1];\n                path = that.groupPaths[groupIndex][index - 1].end;\n                that.animateLine(line, path, time, startTime);\n                startTime += time;\n            } else {\n                startTime = 0;\n            }\n\n            if (that.dotOpacity) {\n                setTimeout(function() {\n                    dot.attr(tui.util.extend({'fill-opacity': that.dotOpacity}, that.borderStyle));\n                }, startTime);\n            }\n        });\n\n        if (callback) {\n            setTimeout(callback, startTime);\n        }\n    },\n\n    /**\n     * To resize graph of line chart.\n     * @param {object} params parameters\n     *      @param {{width: number, height:number}} params.dimension dimension\n     *      @param {array.&lt;array.&lt;{left:number, top:number}>>} params.groupPositions group positions\n     */\n    resize: function(params) {\n        var dimension = params.dimension,\n            groupPositions = params.groupPositions,\n            that = this;\n\n        this.groupPositions = groupPositions;\n        this.groupPaths = this._getLinesPath(groupPositions);\n        this.paper.setSize(dimension.width, dimension.height);\n        this.tooltipLine.attr({top: dimension.height});\n\n        this.renderItems(function(dot, groupIndex, index) {\n            var position = groupPositions[groupIndex][index],\n                dotAttrs = {\n                    cx: position.left,\n                    cy: position.top\n                },\n                line, path;\n            if (index) {\n                line = that.groupLines[groupIndex][index - 1];\n                path = that.groupPaths[groupIndex][index - 1].end;\n                line.attr({path: path});\n            }\n\n            if (that.dotOpacity) {\n                dotAttrs = tui.util.extend({'fill-opacity': that.dotOpacity}, dotAttrs, that.borderStyle);\n            }\n\n            dot.attr(dotAttrs);\n        });\n    }\n});\n\nmodule.exports = RaphaelLineChart;\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"