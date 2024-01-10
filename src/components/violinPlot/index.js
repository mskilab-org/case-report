import React, { Component } from "react";
import { PropTypes } from "prop-types";
import * as d3 from "d3";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { legendColors } from "../../helpers/utility";
import Wrapper from "./index.style";

const margins = {
  gap: 0,
  gapX: 34,
  gapY: 22,
  yTicksCount: 10,
};

class ViolinPlot extends Component {
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
    const { t, width, height, plots, markers } = this.props;

    let stageWidth = width - 2 * margins.gapX;
    let stageHeight = height - 3 * margins.gapY;

    let panelWidth = stageWidth;
    let panelHeight = stageHeight;

    let xScale = d3
      .scaleBand()
      .domain(plots.map((d) => d.id))
      .range([0, panelWidth]);

    let histograms = plots.map((plot) => {
      let markValue = markers[plot.id];

      let extent = [
        d3.min([...plot.data, markValue]),
        d3.max([...plot.data, markValue]),
      ];

      let extentToQ99 = [
        d3.min([...plot.data, markValue]),
        d3.max([plot.q99, markValue]),
      ];

      const scaleY = d3
        .scaleLinear()
        .domain(extentToQ99)
        .range([panelHeight, 0])
        .nice();

      const n = plot.data.length;
      const y = d3.scaleLinear().domain(extent).range([panelHeight, 0]).nice();
      const bins = d3
        .bin()
        .domain(y.domain())
        .thresholds(
          y.ticks(
            Math.ceil(
              (Math.pow(n, 1 / 3) * (d3.max(plot.data) - d3.min(plot.data))) /
                (3.5 * d3.deviation(plot.data))
            )
          )
        )(plot.data);

      // Create a scale for the y-axis
      const scaleX = d3
        .scaleLinear()
        .domain([0, d3.max(bins, (d) => d.length)])
        .range([xScale.step(), 25])
        .nice();
      return { t, plot, scaleX, scaleY, bins };
    });

    return {
      width,
      height,
      panelWidth,
      panelHeight,
      xScale,
      histograms,
      markers,
    };
  }

  renderXAxis() {
    const { xScale, panelHeight } = this.getPlotConfiguration();

    let xAxisContainer = d3
      .select(this.plotContainer)
      .select(".x-axis-container");

    const axisX = d3.axisBottom(xScale).tickSize(-panelHeight);

    xAxisContainer.call(axisX);

    let t = this.props.t;
    xAxisContainer
      .selectAll("text")
      .attr("text-anchor", "middle")
      .attr("dy", 20)
      .text((x) => t(`metadata.${x}.short`));
  }

  renderYAxis() {
    const { xScale, histograms } = this.getPlotConfiguration();
    let yAxisContainer = d3
      .select(this.plotContainer)
      .select(".y-axis-container")
      .selectAll(".distribution-axis")
      .data(histograms, (d) => d.plot.id);

    yAxisContainer
      .enter()
      .append("g")
      .attr("class", "distribution-axis")
      .attr(
        "transform",
        (d, i) => `translate(${[xScale(d.plot.id) + xScale.step() / 2, 0]})`
      )
      .each(function (d, i) {
        d3.select(this).call(
          d3
            .axisLeft(d.scaleY)
            .tickSize(3)
            .tickFormat(
              d.scaleY.domain()[1] < 100 ? d3.format(".2f") : d3.format("~s")
            )
        );

        d3.select(this)
          .selectAll("text")
          .style("fill", (x) => {
            return x < d.plot.q1
              ? legendColors()[0]
              : x > d.plot.q3
              ? legendColors()[2]
              : legendColors()[1];
          });

        d3.select(this)
          .selectAll("line")
          .style("stroke", (x) => {
            return x < d.plot.q1
              ? legendColors()[0]
              : x > d.plot.q3
              ? legendColors()[2]
              : legendColors()[1];
          });
      });
  }

  render() {
    const {
      width,
      height,
      panelWidth,
      panelHeight,
      xScale,
      histograms,
      markers,
    } = this.getPlotConfiguration();

    return (
      <Wrapper className="ant-wrapper" margins={margins}>
        <div
          className="histogram-plot"
          style={{ width: panelWidth, height: panelHeight }}
          ref={(elem) => (this.container = elem)}
        />
        <svg
          width={width}
          height={height}
          className="plot-container"
          ref={(elem) => (this.plotContainer = elem)}
        >
          <defs>
            <clipPath key="cuttOffViewPane" id="cuttOffViewPane">
              <rect
                x={0}
                y={0}
                width={2 * panelWidth}
                height={1 * panelHeight}
              />
            </clipPath>
          </defs>
          <g transform={`translate(${[margins.gapX, margins.gapY]})`}>
            <g key={`panel`} id={`panel`} transform={`translate(${[0, 0]})`}>
              <g
                className="axis--y y-axis-container"
                transform={`translate(${[margins.gap, 0]})`}
              ></g>
              <g
                clipPath=""
                className="axis--x x-axis-container"
                transform={`translate(${[margins.gap, panelHeight]})`}
              ></g>
              <g clipPath="url(#cuttOffViewPane)">
                {histograms.map((hist) => (
                  <g
                    clipPath="url(#cuttOffViewPane0)"
                    transform={`translate(${[
                      xScale(hist.plot.id) + 1.5 * xScale.step(),
                      0,
                    ]})`}
                  >
                    <path
                      fill="#CCC"
                      fillOpacity={1}
                      stroke="lightgray"
                      strokeWidth="0"
                      d={d3
                        .area()
                        .y((d) => hist.scaleY((d.x0 + d.x1) / 2))
                        .x0((d) => -hist.scaleX(d.length))
                        .x1(-hist.scaleX(0))
                        .curve(d3.curveBasis)(hist.bins)}
                    />
                    <path
                      fill="#999999"
                      fillOpacity={0}
                      stroke="gray"
                      strokeWidth="0.33"
                      d={d3
                        .area()
                        .y((d) => hist.scaleY((d.x0 + d.x1) / 2))
                        .x0((d) => -hist.scaleX(d.length))
                        .x1(-hist.scaleX(0))
                        .curve(d3.curveBasis)(hist.bins)}
                    />
                    <g
                      transform={`translate(${[
                        -1.5 * xScale.step(),
                        hist.scaleY(markers[hist.plot.id]),
                      ]})`}
                    >
                      <line
                        x1={xScale.step()}
                        x2={xScale.step() / 2}
                        stroke="red"
                        strokeWidth={1}
                      />
                    </g>
                  </g>
                ))}
              </g>
            </g>
          </g>
        </svg>
      </Wrapper>
    );
  }
}
ViolinPlot.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  data: PropTypes.array,
  markValue: PropTypes.number,
};
ViolinPlot.defaultProps = {
  data: [],
};
const mapDispatchToProps = () => ({});
const mapStateToProps = () => ({});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("common")(ViolinPlot));