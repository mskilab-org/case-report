import React, { Component } from "react";
import { PropTypes } from "prop-types";
import * as d3 from "d3";
import { hexbin } from "d3-hexbin";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { Legend } from "../../helpers/utility";
import Wrapper from "./index.style";

const margins = {
  gap: 0,
  gapX: 34,
  gapY: 12,
  yTicksCount: 10,
};

class DensityPlot extends Component {
  plotContainer = null;

  componentDidMount() {
    this.renderYAxis();
    this.renderXAxis();
  }

  componentDidUpdate() {
    this.renderYAxis();
    this.renderXAxis();
  }

  getPlotConfiguration() {
    const {
      width,
      height,
      dataPoints,
      xRange,
      yRange,
      xVariable,
      yVariable,
      xFormat,
      yFormat,
      radius,
      xTitle,
      yTitle,
      t,
    } = this.props;

    let stageWidth = width - 2 * margins.gapX;
    let stageHeight = height - 3 * margins.gapY;

    let panelWidth = stageWidth;
    let panelHeight = stageHeight - 50;

    let xScale = d3.scaleLinear().domain(xRange).range([0, panelWidth]).nice();
    let yScale = d3.scaleLinear().domain(yRange).range([panelHeight, 0]).nice();

    // Bin the data.
    const hexbinGenerator = hexbin()
      .x((d) => xScale(d[xVariable]))
      .y((d) => yScale(d[yVariable]))
      .radius((radius * panelWidth) / 928)
      .extent([
        [0, 0],
        [panelWidth, panelHeight],
      ]);

    const bins = hexbinGenerator(dataPoints);

    // Create the color scale.
    const color = d3.scaleQuantize(
      [0, d3.max(bins, (d) => d.length)],
      d3.schemePurples[5]
    );

    let legend = Legend(color, {
      title: t("general.count"),
      tickFormat: ".0f",
    });

    return {
      width,
      height,
      panelWidth,
      panelHeight,
      xScale,
      yScale,
      xFormat,
      yFormat,
      color,
      bins,
      hexbinGenerator,
      legend,
      xTitle,
      yTitle,
    };
  }

  renderXAxis() {
    const { xScale, xFormat } = this.getPlotConfiguration();

    let xAxisContainer = d3
      .select(this.plotContainer)
      .select(".x-axis-container");

    const axisX = d3.axisBottom(xScale).tickFormat(d3.format(xFormat));

    xAxisContainer.call(axisX);
  }

  renderYAxis() {
    const { yScale, yFormat } = this.getPlotConfiguration();

    let yAxisContainer = d3
      .select(this.plotContainer)
      .select(".y-axis-container");

    let yAxis = d3.axisLeft(yScale).tickFormat(d3.format(yFormat));
    yAxisContainer.call(yAxis);
  }

  render() {
    const {
      width,
      height,
      panelWidth,
      panelHeight,
      color,
      bins,
      hexbinGenerator,
      legend,
      xTitle,
      yTitle,
    } = this.getPlotConfiguration();

    console.log(legend);
    const svgString = new XMLSerializer().serializeToString(legend);
    return (
      <Wrapper className="ant-wrapper" margins={margins}>
        <div
          style={{ width: panelWidth, height: 50, marginLeft: 34 }}
          dangerouslySetInnerHTML={{ __html: svgString }}
        />
        <div
          className="histogram-plot"
          style={{ width: width, height: height }}
          ref={(elem) => (this.container = elem)}
        >
          <svg
            width={width}
            height={height}
            className="plot-container"
            ref={(elem) => (this.plotContainer = elem)}
          >
            <g transform={`translate(${[margins.gapX, margins.gapY]})`}>
              <g key={`panel`} id={`panel`} transform={`translate(${[0, 0]})`}>
                <g clipPath="url(#cuttOffViewPane)">
                  <rect
                    width={panelWidth}
                    height={panelHeight}
                    fill="whitesmoke"
                    opacity={0.33}
                  />
                  {bins.map((bin) => (
                    <path
                      transform={`translate(${bin.x},${bin.y})`}
                      d={hexbinGenerator.hexagon()}
                      fill={color(bin.length)}
                      stroke="#FFF"
                      strokeWidth={0.33}
                    ></path>
                  ))}
                </g>
                <g
                  className="axis--y y-axis-container"
                  transform={`translate(${[margins.gap, 0]})`}
                ></g>
                <g clipPath="" className="axis--y-text" transform={``}>
                  <text
                    className="x-axis-title"
                    transform={`rotate(-90)`}
                    x={-height / 2}
                    y={-2 * margins.gapY}
                    textAnchor="middle"
                  >
                    {yTitle}
                  </text>
                </g>
                <g
                  clipPath=""
                  className="axis--x x-axis-container"
                  transform={`translate(${[margins.gap, panelHeight]})`}
                ></g>
                <g
                  clipPath=""
                  className="axis--x-text"
                  transform={`translate(${[
                    panelWidth / 2,
                    panelHeight + 2.5 * margins.gapY,
                  ]})`}
                >
                  <text className="x-axis-title">{xTitle}</text>
                </g>
              </g>
            </g>
          </svg>
        </div>
      </Wrapper>
    );
  }
}
DensityPlot.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  data: PropTypes.array,
};
DensityPlot.defaultProps = {
  data: [],
  radius: 3.33,
};
const mapDispatchToProps = () => ({});
const mapStateToProps = () => ({});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("common")(DensityPlot));
