ne.util.defineNamespace("fedoc.content", {});
fedoc.content["plugins_raphaelLineChart.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview Raphael line chart renderer.\n * @author NHN Ent.\n *         FE Development Team &lt;dl_javascript@nhnent.com>\n */\n\n'use strict';\n\nvar RaphaelLineBase = require('./raphaelLineTypeBase'),\n    raphaelRenderUtil = require('./raphaelRenderUtil');\n\nvar Raphael = window.Raphael,\n    ANIMATION_TIME = 700;\n\n/**\n * @classdesc RaphaelLineCharts is graph renderer for line chart.\n * @class RaphaelLineChart\n * @extends RaphaelLineTypeBase\n */\nvar RaphaelLineChart = tui.util.defineClass(RaphaelLineBase, /** @lends RaphaelLineChart.prototype */ {\n    /**\n     * Render function of line chart.\n     * @param {object} paper raphael paper\n     * @param {HTMLElement} container container\n     * @param {{groupPositions: array.&lt;array>, dimension: object, theme: object, options: object}} data render data\n     * @param {function} inCallback in callback\n     * @param {function} outCallback out callback\n     * @return {object} paper raphael paper\n     */\n    render: function(paper, container, data, inCallback, outCallback) {\n        var dimension = data.dimension,\n            groupPositions = data.groupPositions,\n            theme = data.theme,\n            colors = theme.colors,\n            opacity = data.options.hasDot ? 1 : 0,\n            groupPaths = this._getLinesPath(groupPositions),\n            borderStyle = this.makeBorderStyle(theme.borderColor, opacity),\n            outDotStyle = this.makeOutDotStyle(opacity, borderStyle),\n            groupLines, tooltipLine, groupDots;\n\n        if (!paper) {\n            paper = Raphael(container, dimension.width, dimension.height);\n        }\n\n        groupLines = this._renderLines(paper, groupPaths, colors);\n        tooltipLine = this._renderTooltipLine(paper, dimension.height);\n        groupDots = this.renderDots(paper, groupPositions, colors, borderStyle);\n\n        this.borderStyle = borderStyle;\n        this.outDotStyle = outDotStyle;\n        this.groupPaths = groupPaths;\n        this.groupLines = groupLines;\n        this.tooltipLine = tooltipLine;\n        this.groupDots = groupDots;\n        this.dotOpacity = opacity;\n\n        this.attachEvent(groupDots, groupPositions, outDotStyle, inCallback, outCallback);\n\n        return paper;\n    },\n\n    /**\n     * Get lines path.\n     * @param {array.&lt;array.&lt;object>>} groupPositions positions\n     * @returns {array.&lt;array.&lt;string>>} paths\n     * @private\n     */\n    _getLinesPath: function(groupPositions) {\n        var groupPaths = tui.util.map(groupPositions, function(positions) {\n            var fromPos = positions[0],\n                rest = positions.slice(1);\n            return tui.util.map(rest, function(position) {\n                var result = this.makeLinePath(fromPos, position);\n                fromPos = position;\n                return result;\n            }, this);\n        }, this);\n        return groupPaths;\n    },\n\n    /**\n     * Render lines.\n     * @param {object} paper raphael paper\n     * @param {array.&lt;array.&lt;string>>} groupPaths paths\n     * @param {string[]} colors line colors\n     * @param {number} strokeWidth stroke width\n     * @returns {array.&lt;array.&lt;object>>} lines\n     * @private\n     */\n    _renderLines: function(paper, groupPaths, colors, strokeWidth) {\n        var groupLines = tui.util.map(groupPaths, function(paths, groupIndex) {\n            var color = colors[groupIndex] || 'transparent';\n            return tui.util.map(paths, function(path) {\n                return raphaelRenderUtil.renderLine(paper, path.start, color, strokeWidth);\n            }, this);\n        }, this);\n\n        return groupLines;\n    },\n\n    /**\n     * Animate.\n     * @param {function} callback callback\n     */\n    animate: function(callback) {\n        var groupLines = this.groupLines,\n            groupPaths = this.groupPaths,\n            borderStyle = this.borderStyle,\n            opacity = this.dotOpacity,\n            time = ANIMATION_TIME / groupLines[0].length,\n            startTime;\n        tui.util.forEachArray(this.groupDots, function(dots, groupIndex) {\n            startTime = 0;\n            tui.util.forEachArray(dots, function(dot, index) {\n                var line, path;\n                if (index) {\n                    line = groupLines[groupIndex][index - 1];\n                    path = groupPaths[groupIndex][index - 1].end;\n                    this.animateLine(line, path, time, startTime);\n                    startTime += time;\n                }\n\n                if (opacity) {\n                    setTimeout(function() {\n                        dot.attr(tui.util.extend({'fill-opacity': opacity}, borderStyle));\n                    }, startTime);\n                }\n            }, this);\n        }, this);\n\n        if (callback) {\n            setTimeout(callback, startTime);\n        }\n    }\n});\n\nmodule.exports = RaphaelLineChart;\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"