import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Row, Col, Skeleton } from "antd";
import Wrapper from "./index.style";
import ViolinPlotPanel from "../../components/violinPlotPanel";
import FilteredEventsListPanel from "../../components/filteredEventsListPanel";

class SummaryTab extends Component {
  render() {
    const { t, loading, metadata, plots, tumorPlots } = this.props;

    return (
      <Wrapper>
        <Skeleton active loading={loading}>
          <Row
            key={0}
            id={`row-${0}}`}
            className="ant-panel-container ant-home-plot-container"
            gutter={16}
          >
            <Col className="gutter-row" span={12}>
              {
                <ViolinPlotPanel
                  {...{
                    title: t("components.violin-panel.header.total"),
                    plots: plots,
                    markers: metadata,
                  }}
                />
              }
            </Col>
            <Col className="gutter-row" span={12}>
              {
                <ViolinPlotPanel
                  {...{
                    title: t("components.violin-panel.header.tumor", {
                      tumor: metadata.tumor,
                    }),
                    plots: tumorPlots,
                    markers: metadata,
                  }}
                />
              }
            </Col>
          </Row>
        </Skeleton>
        <FilteredEventsListPanel />
      </Wrapper>
    );
  }
}
SummaryTab.propTypes = {};
SummaryTab.defaultProps = {};
const mapDispatchToProps = (dispatch) => ({});
const mapStateToProps = (state) => ({
  loading: state.PopulationStatistics.loading,
  metadata: state.CaseReport.metadata,
  plots: state.PopulationStatistics.general,
  tumorPlots: state.PopulationStatistics.tumor,
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("common")(SummaryTab));