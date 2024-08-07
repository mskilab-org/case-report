import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Row, Col } from "antd";
import DensityPlotPanel from "../densityPlotPanel";
import DistributionPlotPanel from "../distributionPlotPanel";
import Wrapper from "./index.style";

class QcTab extends Component {
  render() {
    const { t, dataPoints } = this.props;
    return (
      <Wrapper>
        <Row
          className="ant-panel-container ant-home-plot-container"
          gutter={16}
        >
          <Col className="gutter-row" span={24}>
            <DensityPlotPanel
              dataPoints={dataPoints}
              xTitle={t("components.variantQc-panel.x-title")}
              xVariable="tumor_vaf"
              xRange={[0, 1]}
              xFormat=".0%"
              yTitle={t("components.variantQc-panel.y-title")}
              yVariable="tumor_abq"
              yFormat=".0f"
              yRange={[0, 50]}
              title={t("components.variantQc-panel.title")}
              colorVariable="tumor_depth"
            />
          </Col>
        </Row>
        <Row
          className="ant-panel-container ant-home-plot-container"
          gutter={16}
        >
          <Col className="gutter-row" span={24}>
            <DistributionPlotPanel
              dataPoints={dataPoints}
              xTitle={t("components.sageQc-panel.x-title")}
              xVariable="tumor_vaf"
              xRange={[0, 1]}
              xFormat=".0%"
              yTitle={t("components.sageQc-panel.y-title")}
              yVariable="tumor_alt_counts"
              yFormat=".0f"
              yRange={[0, 40]}
              title={t("components.sageQc-panel.title")}
              colorVariable="tumor_abq"
            />
          </Col>
        </Row>
      </Wrapper>
    );
  }
}
QcTab.propTypes = {};
QcTab.defaultProps = {
  dataPoints: [],
};
const mapDispatchToProps = (dispatch) => ({});
const mapStateToProps = (state) => ({});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("common")(QcTab));
