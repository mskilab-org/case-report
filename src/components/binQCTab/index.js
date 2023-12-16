import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Row, Col } from "antd";
import Wrapper from "./index.style";
import BinPlotPanel from "../binPlotPanel";

class BinQcTab extends Component {
  render() {
    const { t, fits, imageBlob, chromoBins } = this.props;
    return (
      <Wrapper>
        <Row
          className="ant-panel-container ant-home-plot-container"
          gutter={16}
        >
          <Col className="gutter-row" span={24}>
            <BinPlotPanel
              {...{
                data: fits,
                title: t(`components.binQc-panel.binplot.title`),
                xTitle: t(`components.binQc-panel.binplot.x-title`),
                yTitle: t(`components.binQc-panel.binplot.y-title`),
                chromoBins,
              }}
            />
          </Col>
        </Row>
        <Row
          className="ant-panel-container ant-home-plot-container"
          gutter={16}
        >
          <Col className="gutter-row" span={12}>
            {imageBlob && (
              <img
                src={URL.createObjectURL(imageBlob)}
                alt="ppFit"
                height={722}
              />
            )}
          </Col>
        </Row>
      </Wrapper>
    );
  }
}
BinQcTab.propTypes = {};
BinQcTab.defaultProps = {};
const mapDispatchToProps = (dispatch) => ({});
const mapStateToProps = (state) => ({});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("common")(BinQcTab));
