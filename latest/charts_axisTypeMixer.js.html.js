ne.util.defineNamespace("fedoc.content", {});
fedoc.content["charts_axisTypeMixer.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview axisTypeMixer is mixer of axis type chart(bar, column, line, area).\n * @author NHN Ent.\n *         FE Development Team &lt;dl_javascript@nhnent.com>\n */\n\n'use strict';\n\nvar Axis = require('../axes/axis'),\n    Plot = require('../plots/plot'),\n    Legend = require('../legends/legend'),\n    Tooltip = require('../tooltips/tooltip'),\n    GroupTooltip = require('../tooltips/groupTooltip');\n\n/**\n * axisTypeMixer is base class of axis type chart(bar, column, line, area).\n * @mixin\n */\nvar axisTypeMixer = {\n    /**\n     * Add axis components\n     * @param {object} params parameters\n     *      @param {object} params.covertData converted data\n     *      @param {object} params.axes axes data\n     *      @param {object} params.plotData plot data\n     *      @param {function} params.Series series class\n     */\n    addAxisComponents: function(params) {\n        var convertedData = params.convertedData,\n            options = this.options,\n            aligned = !!params.aligned;\n\n        if (params.plotData) {\n            this.addComponent('plot', Plot, params.plotData);\n        }\n\n        tui.util.forEach(params.axes, function(data, name) {\n            this.addComponent(name, Axis, {\n                data: data,\n                aligned: aligned\n            });\n        }, this);\n\n        if (convertedData.joinLegendLabels) {\n            this.addComponent('legend', Legend, {\n                joinLegendLabels: convertedData.joinLegendLabels,\n                legendLabels: convertedData.legendLabels,\n                chartType: params.chartType\n            });\n        }\n\n        this.addComponent('series', params.Series, tui.util.extend({\n            libType: options.libType,\n            chartType: options.chartType,\n            parentChartType: options.parentChartType,\n            aligned: aligned,\n            isSubChart: this.isSubChart,\n            isGroupedTooltip: this.isGroupedTooltip\n        }, params.seriesData));\n\n        if (this.isGroupedTooltip) {\n            this.addComponent('tooltip', GroupTooltip, {\n                labels: convertedData.labels,\n                joinFormattedValues: convertedData.joinFormattedValues,\n                joinLegendLabels: convertedData.joinLegendLabels,\n                chartId: this.chartId\n            });\n        } else {\n            this.addComponent('tooltip', Tooltip, {\n                values: convertedData.values,\n                formattedValues: convertedData.formattedValues,\n                labels: convertedData.labels,\n                legendLabels: convertedData.legendLabels,\n                chartId: this.chartId,\n                isVertical: this.isVertical\n            });\n        }\n    },\n\n    /**\n     * To make plot data.\n     * @param {object} plotData initialized plot data\n     * @param {object} axesData axes data\n     * @returns {{vTickCount: number, hTickCount: number}} plot data\n     */\n    makePlotData: function(plotData, axesData) {\n        if (tui.util.isUndefined(plotData)) {\n            plotData = {\n                vTickCount: axesData.yAxis.validTickCount,\n                hTickCount: axesData.xAxis.validTickCount\n            };\n        }\n        return plotData;\n    },\n\n    /**\n     * Mix in.\n     * @param {function} func target function\n     * @ignore\n     */\n    mixin: function(func) {\n        tui.util.extend(func.prototype, this);\n    }\n};\n\nmodule.exports = axisTypeMixer;\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"