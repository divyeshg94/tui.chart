ne.util.defineNamespace("fedoc.content", {});
fedoc.content["helpers_boundsMaker.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview Bounds maker.\n * @author NHN Ent.\n *         FE Development Team &lt;dl_javascript@nhnent.com>\n */\n\n'use strict';\n\nvar chartConst = require('../const'),\n    calculator = require('./calculator'),\n    renderUtil = require('./renderUtil');\n\nvar concat = Array.prototype.concat;\n\n/**\n * Bounds maker.\n * @module boundsMaker\n */\nvar boundsMaker = {\n    /**\n     * Get max label of value axis.\n     * @memberOf module:boundsMaker\n     * @param {object} convertedData convert data\n     * @param {string} chartType chart type\n     * @returns {number|string} max label\n     * @private\n     */\n    _getValueAxisMaxLabel: function(convertedData, chartType) {\n        var values = chartType &amp;&amp; convertedData.values[chartType] || convertedData.joinValues,\n            formatFunctions = convertedData.formatFunctions,\n            flattenValues = concat.apply([], values),\n            min = tui.util.min(flattenValues),\n            max = tui.util.max(flattenValues),\n            scale = calculator.calculateScale(min, max),\n            minLabel = calculator.normalizeAxisNumber(scale.min),\n            maxLabel = calculator.normalizeAxisNumber(scale.max),\n            fns = formatFunctions &amp;&amp; formatFunctions.slice() || [];\n        maxLabel = (minLabel + '').length > (maxLabel + '').length ? minLabel : maxLabel;\n        fns.unshift(maxLabel);\n        maxLabel = tui.util.reduce(fns, function(stored, fn) {\n            return fn(stored);\n        });\n        return maxLabel;\n    },\n\n    /**\n     * Get height of x axis area.\n     * @memberOf module:boundsMaker\n     * @param {object} options x axis options,\n     * @param {array.&lt;string>} labels axis labels\n     * @param {object} theme axis theme\n     * @returns {number} height\n     * @private\n     */\n    _getXAxisHeight: function(options, labels, theme) {\n        var title = options &amp;&amp; options.title,\n            titleAreaHeight = renderUtil.getRenderedLabelHeight(title, theme.title) + chartConst.TITLE_PADDING,\n            height = renderUtil.getRenderedLabelsMaxHeight(labels, theme.label) + titleAreaHeight;\n        return height;\n    },\n\n    /**\n     * Get width about y axis.\n     * @param {object} options y axis options\n     * @param {array.&lt;string>} labels labels\n     * @param {object} theme yAxis theme\n     * @param {number} index options index\n     * @returns {number} y axis width\n     * @private\n     */\n    _getYAxisWidth: function(options, labels, theme, index) {\n        var title = '',\n            titleAreaWidth, width;\n\n        if (options) {\n            options = [].concat(options);\n            title = options[index || 0].title;\n        }\n\n        titleAreaWidth = renderUtil.getRenderedLabelHeight(title, theme.title) + chartConst.TITLE_PADDING;\n        width = renderUtil.getRenderedLabelsMaxWidth(labels, theme.label) + titleAreaWidth + chartConst.AXIS_LABEL_PADDING;\n\n        return width;\n    },\n\n    /**\n     * Get width about y right axis.\n     * @memberOf module:boundsMaker\n     * @param {object} params parameters\n     *      @param {array.&lt;string>} params.chartTypes y axis chart types\n     *      @param {object} params.theme y axis theme\n     *      @param {object} params.options y axis options\n     * @returns {number} y right axis width\n     * @private\n     */\n    _getYRAxisWidth: function(params) {\n        var chartTypes = params.chartTypes || [],\n            len = chartTypes.length,\n            width = 0,\n            index, chartType, theme, label;\n        if (len > 0) {\n            index = len - 1;\n            chartType = chartTypes[index];\n            theme = params.theme[chartType] || params.theme;\n            label = this._getValueAxisMaxLabel(params.convertedData, chartType);\n            width = this._getYAxisWidth(params.options, [label], theme, index);\n        }\n        return width;\n    },\n\n    /**\n     * To make axes dimension.\n     * @memberOf module:boundsMaker\n     * @param {object} params parameters\n     *      @param {object} params.convertedData converted data\n     *      @param {object} params.theme chart theme\n     *      @param {boolean} params.isVertical whether vertical or not\n     *      @param {object} params.options chart options\n     *      *      @param {object} params.axesLabelInfo axes label info\n     * @returns {{\n     *      yAxis: {width: number},\n     *      yrAxis: {width: number},\n     *      xAxis: {height: number}\n     * }} axes dimension\n     * @private\n     */\n    _makeAxesDimension: function(params) {\n        var yAxisWidth = 0,\n            xAxisHeight = 0,\n            yrAxisWidth = 0,\n            axesLabelInfo, chartType;\n\n        // axis 영역이 필요 있는 경우에만 처리\n        if (params.hasAxes) {\n            axesLabelInfo = params.axesLabelInfo;\n            chartType = params.optionChartTypes &amp;&amp; params.optionChartTypes[0] || '';\n            yAxisWidth = this._getYAxisWidth(params.options.yAxis, axesLabelInfo.yAxis, params.theme.yAxis[chartType] || params.theme.yAxis);\n            xAxisHeight = this._getXAxisHeight(params.options.xAxis, axesLabelInfo.xAxis, params.theme.xAxis);\n            yrAxisWidth = this._getYRAxisWidth({\n                convertedData: params.convertedData,\n                chartTypes: params.optionChartTypes,\n                theme: params.theme.yAxis,\n                options: params.options.yAxis\n            });\n        }\n\n        return {\n            yAxis: {\n                width: yAxisWidth\n            },\n            yrAxis: {\n                width: yrAxisWidth\n            },\n            xAxis: {\n                height: xAxisHeight\n            }\n        };\n    },\n\n    /**\n     * To make legend dimension.\n     * @memberOf module:boundsMaker\n     * @param {array.&lt;string>} joinLegendLabels legend labels\n     * @param {object} labelTheme label theme\n     * @param {string} chartType chart type\n     * @param {object} seriesOption series option\n     * @returns {{width: number}} legend dimension\n     * @private\n     */\n    _makeLegendDimension: function(joinLegendLabels, labelTheme, chartType, seriesOption) {\n        var legendWidth = 0,\n            legendLabels, maxLabelWidth;\n\n        seriesOption = seriesOption || {};\n\n        if (chartType !== chartConst.CHART_TYPE_PIE || !seriesOption.legendType) {\n            legendLabels = tui.util.map(joinLegendLabels, function(item) {\n                return item.label;\n            });\n            maxLabelWidth = renderUtil.getRenderedLabelsMaxWidth(legendLabels, labelTheme);\n            legendWidth = maxLabelWidth + chartConst.LEGEND_RECT_WIDTH +\n                chartConst.LEGEND_LABEL_LEFT_PADDING + (chartConst.LEGEND_AREA_PADDING * 2);\n        }\n\n        return {\n            width: legendWidth\n        };\n    },\n\n    /**\n     * To make series dimension.\n     * @memberOf module:boundsMaker\n     * @param {object} params parameters\n     *      @param {{width: number, height: number}} params.chartDimension chart dimension\n     *      @param {{\n     *          yAxis: {width: number, height:number},\n     *          xAxis: {width: number, height:number},\n     *          yrAxis: {width: number, height:number}\n     *      }} params.axesDimension axes dimension\n     *      @param {number} params.legendWidth legend width\n     *      @param {number} params.titleHeight title height\n     * @returns {{width: number, height: number}} series dimension\n     * @private\n     */\n    _makeSeriesDimension: function(params) {\n        var axesDimension = params.axesDimension,\n            rightAreaWidth = params.legendWidth + axesDimension.yrAxis.width,\n            width = params.chartDimension.width - (chartConst.CHART_PADDING * 2) - axesDimension.yAxis.width - rightAreaWidth,\n            height = params.chartDimension.height - (chartConst.CHART_PADDING * 2) - params.titleHeight - axesDimension.xAxis.height;\n\n        return {\n            width: width,\n            height: height\n        };\n    },\n\n    /**\n     * To make chart dimension.\n     * @param {{width: number, height: number}} chartOptions chart options\n     * @returns {{width: (number), height: (number)}} chart dimension\n     * @private\n     */\n    _makeChartDimension: function(chartOptions) {\n        return {\n            width: chartOptions.width || chartConst.CHART_DEFAULT_WIDTH,\n            height: chartOptions.height || chartConst.CHART_DEFAULT_HEIGHT\n        };\n    },\n\n    /**\n     * To make title dimension\n     * @param {{title: string}} option title option\n     * @param {{fontFamily: string, fontSize: number}} theme title theme\n     * @returns {{height: number}} title dimension\n     * @private\n     */\n    _makeTitleDimension: function(option, theme) {\n        return {\n            height: renderUtil.getRenderedLabelHeight(option, theme) + chartConst.TITLE_PADDING\n        };\n    },\n\n    /**\n     * To make plot dimention\n     * @param {{width: number, height: number}} seriesDimension series dimension\n     * @returns {{width: number, height: number}} plot dimension\n     * @private\n     */\n    _makePlotDimension: function(seriesDimension) {\n        return {\n            width: seriesDimension.width + chartConst.HIDDEN_WIDTH,\n            height: seriesDimension.height + chartConst.HIDDEN_WIDTH\n        };\n    },\n\n    /**\n     * Get components dimension\n     * @memberOf module:boundsMaker\n     * @param {object} params parameters\n     *      @param {object} params.convertedData converted data\n     *      @param {object} params.theme chart theme\n     *      @param {boolean} params.isVertical whether vertical or not\n     *      @param {object} params.options chart options\n     *      @param {object} params.axesLabelInfo axes label info\n     * @returns {Object} components dimensions\n     * @private\n     */\n    _getComponentsDimensions: function(params) {\n        var chartOptions = params.options.chart || {},\n            chartDimension = this._makeChartDimension(chartOptions),\n            titleDimension = this._makeTitleDimension(chartOptions.title, params.theme.title),\n            axesDimension = this._makeAxesDimension(params),\n            legendDimension = this._makeLegendDimension(params.convertedData.joinLegendLabels, params.theme.legend.label, params.chartType, params.options.series),\n            seriesDimension = this._makeSeriesDimension({\n                chartDimension: chartDimension,\n                axesDimension: axesDimension,\n                legendWidth: legendDimension.width,\n                titleHeight: titleDimension.height\n            });\n\n        return tui.util.extend({\n            chart: chartDimension,\n            title: titleDimension,\n            series: seriesDimension,\n            plot: this._makePlotDimension(seriesDimension),\n            legend: legendDimension\n        }, axesDimension);\n    },\n\n    /**\n     * To make basic bound.\n     * @param {{width: number, height: number}} dimension series dimension.\n     * @param {number} top top\n     * @param {number} left left\n     * @returns {{dimension: {width: number, height: number}, position: {top: number, left: number}}} series bound.\n     * @private\n     */\n    _makeBasicBound: function(dimension, top, left) {\n        return {\n            dimension: dimension,\n            position: {\n                top: top,\n                left: left\n            }\n        };\n    },\n\n    /**\n     * To make yAxis bound.\n     * @param {{yAxis: {width: number}, plot: {height: number}}} dimensions dimensions\n     * @param {number} top top\n     * @returns {{dimension: {width: number, height: (number)}, position: {top: number, left: number}}} yAxis bound\n     * @private\n     */\n    _makeYAxisBound: function(dimensions, top) {\n        return {\n            dimension: {\n                width: dimensions.yAxis.width,\n                height: dimensions.plot.height\n            },\n            position: {\n                top: top,\n                left: this.chartLeftPadding\n            }\n        };\n    },\n\n    /**\n     * To make xAxis bound.\n     * @param {{xAxis: {height: number}, plot: {width: number}}} dimensions dimensions\n     * @param {number} top top\n     * @param {number} left left\n     * @param {{degree: number}} rotationInfo rotation info\n     * @returns {{dimension: {width: number, height: (number)}, position: {top: number, left: number}}} xAxis bound\n     * @private\n     */\n    _makeXAxisBound: function(dimensions, top, left, rotationInfo) {\n        var bound = {\n            dimension: {\n                width: dimensions.plot.width,\n                height: dimensions.xAxis.height\n            },\n            position: {\n                top: top + dimensions.series.height,\n                left: left - chartConst.HIDDEN_WIDTH\n            }\n        };\n\n        if (rotationInfo) {\n            bound.degree = rotationInfo.degree;\n        }\n\n        return bound;\n    },\n\n    /**\n     * To make yrAxis bound.\n     * @param {{yrAxis: {width: number}, plot: {height: number}, legend: {width: number}}} dimensions dimensions\n     * @param {number} top top\n     * @returns {{dimension: {width: number, height: (number)}, position: {top: number, left: number}}} yrAxis bound\n     * @private\n     */\n    _makeYRAxisBound: function(dimensions, top) {\n        return {\n            dimension: {\n                width: dimensions.yrAxis.width,\n                height: dimensions.plot.height\n            },\n            position: {\n                top: top,\n                right: dimensions.legend.width + chartConst.HIDDEN_WIDTH + chartConst.CHART_PADDING\n            }\n        };\n    },\n\n    /**\n     * To make axes bounds.\n     * @memberOf module:boundsMaker\n     * @param {object} params parameters\n     *      @param {boolean} params.hasAxes whether has axed or not\n     *      @param {array.&lt;string>} params.optionChartTypes y axis chart types\n     *      @param {{width: number, height: number}} params.dimension chart dimension\n     *      @param {number} params.top top position\n     *      @param {number} params.right right position\n     *      @param {{degree: number}} params.rotationInfo rotation info\n     * @returns {object} axes bounds\n     * @private\n     */\n    _makeAxesBounds: function(params) {\n        var bounds;\n\n        // pie차트와 같이 axis 영역이 필요 없는 경우에는 빈 값을 반환 함\n        if (!params.hasAxes) {\n            return {};\n        }\n\n        bounds = {\n            plot: this._makeBasicBound(params.dimensions.plot, params.top, params.left - chartConst.HIDDEN_WIDTH),\n            yAxis: this._makeYAxisBound(params.dimensions, params.top),\n            xAxis: this._makeXAxisBound(params.dimensions, params.top, params.left, params.rotationInfo)\n        };\n\n        // 우측 y axis 영역 bounds 정보 추가\n        if (params.optionChartTypes &amp;&amp; params.optionChartTypes.length) {\n            bounds.yrAxis = this._makeYRAxisBound(params.dimensions, params.top);\n        }\n\n        return bounds;\n    },\n\n    /**\n     * To make chart bound.\n     * @param {{width: number, height: number}} dimension chart dimension.\n     * @returns {{dimension: {width: number, height: number}}} chart bound\n     * @private\n     */\n    _makeChartBound: function(dimension) {\n        return {\n            dimension: dimension\n        };\n    },\n\n    /**\n     * To make legend bound.\n     * @param {{title: {height: number}, series: {width: number}, yrAxis: {width: number}}} dimensions dimensions\n     * @param {number} yAxisWidth yAxis width\n     * @returns {{position: {top: number, left: number}}} legend bound\n     * @private\n     */\n    _makeLegendBound: function(dimensions) {\n        return {\n            position: {\n                top: dimensions.title.height,\n                left: dimensions.yAxis.width + dimensions.series.width + dimensions.yrAxis.width + this.chartLeftPadding\n            }\n        };\n    },\n\n    /**\n     * To make axes label info.\n     * @param {object} params parameters\n     *      @param {boolean} params.hasAxes whether has axes or not\n     *      @param {array} params.optionChartTypes chart types\n     *      @param {object} convertedData converted data\n     *      @param {boolean} isVertical whether vertical or not\n     * @returns {{xAxis: array, yAxis: array}} label info\n     * @private\n     */\n    _makeAxesLabelInfo: function(params) {\n        var chartType, maxValueLabel, yLabels, xLabels;\n\n        if (!params.hasAxes) {\n            return null;\n        }\n\n        chartType = params.optionChartTypes &amp;&amp; params.optionChartTypes[0] || '';\n\n        // value 중 가장 큰 값을 추출하여 value label로 지정 (lable 너비 체크 시 사용)\n        maxValueLabel = this._getValueAxisMaxLabel(params.convertedData, chartType);\n\n        // 세로옵션에 따라서 x축과 y축에 적용할 레이블 정보 지정\n        if (params.isVertical) {\n            yLabels = [maxValueLabel];\n            xLabels = params.convertedData.labels;\n        } else {\n            yLabels = params.convertedData.labels;\n            xLabels = [maxValueLabel];\n        }\n\n        return {\n            xAxis: xLabels,\n            yAxis: yLabels\n        };\n    },\n\n    /**\n     * Find rotation degree.\n     * @param {number} limitWidth limit width\n     * @param {number} labelWidth label width\n     * @param {number} labelHeight label height\n     * @param {number} index candidates index\n     * @returns {number} rotation degree\n     * @private\n     */\n    _findRotationDegree: function(limitWidth, labelWidth, labelHeight) {\n        var foundDegree,\n            halfWidth = labelWidth / 2,\n            halfHeight = labelHeight / 2;\n\n        tui.util.forEachArray(chartConst.DEGREE_CANDIDATES, function(degree) {\n            var compareWidth = (calculator.calculateAdjacent(degree, halfWidth) + calculator.calculateAdjacent(chartConst.ANGLE_90 - degree, halfHeight)) * 2;\n            foundDegree = degree;\n            if (compareWidth &lt;= limitWidth + chartConst.XAXIS_LABEL_COMPARE_MARGIN) {\n                return false;\n            }\n        });\n\n        return foundDegree;\n    },\n\n    /**\n     * To make rotation info about horizontal label.\n     * @param {number} seriesWidth series area width\n     * @param {array.&lt;string>} labels axis labels\n     * @param {object} theme axis label theme\n     * @returns {?object} rotation info\n     * @private\n     */\n    _makeHorizontalLabelRotationInfo: function(seriesWidth, labels, theme) {\n        var maxLabelWidth = renderUtil.getRenderedLabelsMaxWidth(labels, theme),\n            limitWidth = seriesWidth / labels.length - chartConst.XAXIS_LABEL_GUTTER,\n            degree, labelHeight;\n\n        if (maxLabelWidth &lt;= limitWidth) {\n            return null;\n        }\n\n        labelHeight = renderUtil.getRenderedLabelsMaxHeight(labels, theme);\n        degree = this._findRotationDegree(limitWidth, maxLabelWidth, labelHeight);\n\n        return {\n            maxLabelWidth: maxLabelWidth,\n            labelHeight: labelHeight,\n            degree: degree\n        };\n    },\n\n    /**\n     * To calculate overflow position left.\n     * @param {number} yAxisWidth yAxis width\n     * @param {{degree: number, labelHeight: number}} rotationInfo rotation info\n     * @param {string} firstLabel firstLabel\n     * @param {obejct} theme label theme\n     * @returns {number} overflow position left\n     * @private\n     */\n    _calculateOverflowLeft: function(yAxisWidth, rotationInfo, firstLabel, theme) {\n        var degree = rotationInfo.degree,\n            labelHeight = rotationInfo.labelHeight,\n            firstLabelWidth = renderUtil.getRenderedLabelWidth(firstLabel, theme),\n            newLabelWidth = (calculator.calculateAdjacent(degree, firstLabelWidth / 2) + calculator.calculateAdjacent(chartConst.ANGLE_90 - degree, labelHeight / 2)) * 2,\n            diffLeft = newLabelWidth - yAxisWidth;\n        return diffLeft;\n    },\n\n\n    /**\n     * To calculate height of xAxis.\n     * @param {{degree: number, maxLabelWidth: number, labelHeight: number}} rotationInfo rotation info\n     * @returns {number} xAxis height\n     * @private\n     */\n    _calculateXAxisHeight: function(rotationInfo) {\n        var degree = rotationInfo.degree,\n            maxLabelWidth = rotationInfo.maxLabelWidth,\n            labelHeight = rotationInfo.labelHeight,\n            axisHeight = (calculator.calculateOpposite(degree, maxLabelWidth / 2) + calculator.calculateOpposite(chartConst.ANGLE_90 - degree, labelHeight / 2)) * 2;\n        return axisHeight;\n    },\n\n    /**\n     * To calculate height difference between origin label and rotation label.\n     * @param {{degree: number, maxLabelWidth: number, labelHeight: number}} rotationInfo rotation info\n     * @returns {number} height difference\n     * @private\n     */\n    _calculateHeightDifference: function(rotationInfo) {\n        var xAxisHeight = this._calculateXAxisHeight(rotationInfo);\n        return xAxisHeight - rotationInfo.labelHeight;\n    },\n\n    /**\n     * Update degree of rotationInfo.\n     * @param {number} seriesWidth series width\n     * @param {{degree: number, maxLabelWidth: number, labelHeight: number}} rotationInfo rotation info\n     * @param {number} labelLength labelLength\n     * @param {number} overflowLeft overflow left\n     * @private\n     */\n    _updateDegree: function(seriesWidth, rotationInfo, labelLength, overflowLeft) {\n        var limitWidth, newDegree;\n        if (overflowLeft > 0) {\n            limitWidth = seriesWidth / labelLength + chartConst.XAXIS_LABEL_GUTTER;\n            newDegree = this._findRotationDegree(limitWidth, rotationInfo.maxLabelWidth, rotationInfo.labelHeight);\n            rotationInfo.degree = newDegree;\n        }\n    },\n\n    /**\n     * Update width of dimentios.\n     * @param {{plot: {width: number}, series: {width: number}, xAxis: {width: number}}} dimensions dimensions\n     * @param {number} overflowLeft overflow left\n     * @private\n     */\n    _updateDimensionsWidth: function(dimensions, overflowLeft) {\n        if (overflowLeft > 0) {\n            this.chartLeftPadding += overflowLeft;\n            dimensions.plot.width -= overflowLeft;\n            dimensions.series.width -= overflowLeft;\n            dimensions.xAxis.width -= overflowLeft;\n        }\n    },\n\n    /**\n     * Update height of dimensions.\n     * @param {{plot: {height: number}, series: {height: number}, xAxis: {height: number}}} dimensions dimensions\n     * @param {number} diffHeight diff height\n     * @private\n     */\n    _updateDimensionsHeight: function(dimensions, diffHeight) {\n        dimensions.plot.height -= diffHeight;\n        dimensions.series.height -= diffHeight;\n        dimensions.xAxis.height += diffHeight;\n    },\n\n    /**\n     * Update dimensions and degree.\n     * @param {{plot: {width: number, height: number}, series: {width: number, height: number}, xAxis: {width: number, height: number}}} dimensions dimensions\n     * @param {{degree: number, maxLabelWidth: number, labelHeight: number}} rotationInfo rotation info\n     * @param {array} labels labels\n     * @param {object} theme theme\n     * @private\n     */\n    _updateDimensionsAndDegree: function(dimensions, rotationInfo, labels, theme) {\n        var overflowLeft, diffHeight;\n        if (!rotationInfo) {\n            return;\n        }\n        overflowLeft = this._calculateOverflowLeft(dimensions.yAxis.width, rotationInfo, labels[0], theme);\n        this._updateDimensionsWidth(dimensions, overflowLeft);\n        this._updateDegree(dimensions.series.width, rotationInfo, labels.length, overflowLeft);\n        diffHeight = this._calculateHeightDifference(rotationInfo);\n        this._updateDimensionsHeight(dimensions, diffHeight);\n    },\n\n    /**\n     * To make bounds about chart components.\n     * @memberOf module:boundsMaker\n     * @param {object} params parameters\n     *      @param {object} params.convertedData converted data\n     *      @param {object} params.theme chart theme\n     *      @param {boolean} params.isVertical whether vertical or not\n     *      @param {object} params.options chart options\n     *      @param {boolean} params.hasAxes whether has axes area or not\n     *      @param {array} params.optionChartTypes y axis option chart types\n     * @returns {{\n     *   plot: {\n     *     dimension: {width: number, height: number},\n     *     position: {top: number, right: number}\n     *   },\n     *   yAxis: {\n     *     dimension: {width: (number), height: number},\n     *     position: {top: number}\n     *   },\n     *   xAxis: {\n     *     dimension: {width: number, height: (number)},\n     *     position: {right: number}\n     *   },\n     *   series: {\n     *     dimension: {width: number, height: number},\n     *     position: {top: number, right: number}\n     *   },\n     *   legend: {\n     *     position: {top: number}\n     *   },\n     *   tooltip: {\n     *     dimension: {width: number, height: number},\n     *     position: {top: number, left: number}\n     *   }\n     * }} bounds\n     */\n    make: function(params) {\n        var axesLabelInfo = this._makeAxesLabelInfo(params),\n            dimensions = this._getComponentsDimensions(tui.util.extend({\n                axesLabelInfo: axesLabelInfo\n            }, params)),\n            rotationInfo, top, left, seriesBound, axesBounds, bounds;\n\n        this.chartLeftPadding = chartConst.CHART_PADDING;\n        if (params.hasAxes) {\n            rotationInfo = this._makeHorizontalLabelRotationInfo(dimensions.series.width, axesLabelInfo.xAxis, params.theme.label);\n            this._updateDimensionsAndDegree(dimensions, rotationInfo, axesLabelInfo.xAxis, params.theme.label);\n        }\n\n        top = dimensions.title.height + chartConst.CHART_PADDING;\n        left = dimensions.yAxis.width + this.chartLeftPadding;\n        seriesBound = this._makeBasicBound(dimensions.series, top, left);\n\n        axesBounds = this._makeAxesBounds({\n            hasAxes: params.hasAxes,\n            rotationInfo: rotationInfo,\n            optionChartTypes: params.optionChartTypes,\n            dimensions: dimensions,\n            top: top,\n            left: left\n        });\n        bounds = tui.util.extend({\n            chart: this._makeChartBound(dimensions.chart),\n            series: seriesBound,\n            legend: this._makeLegendBound(dimensions),\n            tooltip: this._makeBasicBound(dimensions.series, top, left - chartConst.SERIES_EXPAND_SIZE),\n            eventHandleLayer: seriesBound\n        }, axesBounds);\n        return bounds;\n    }\n};\n\nmodule.exports = boundsMaker;\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"