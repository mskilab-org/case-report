import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import handleViewport from "react-in-viewport";
import {
  Card,
  Space,
  Tooltip,
  Button,
  message,
  Row,
  Col,
  Skeleton,
} from "antd";
import { withTranslation } from "react-i18next";
import { AiOutlineDownload } from "react-icons/ai";
import {
  downloadCanvasAsPng,
  transitionStyle,
  domainsToLocation,
} from "../../helpers/utility";
import ErrorPanel from "../errorPanel";
import * as htmlToImage from "html-to-image";
import logo from "../../assets/images/igv-logo.png";
import Wrapper from "./index.style";
import IgvPlot from "../igvPlot";

const margins = {
  padding: 0,
  gap: 0,
};

class IgvPanel extends Component {
  container = null;

  onDownloadButtonClicked = () => {
    htmlToImage
      .toCanvas(this.container, { pixelRatio: 2 })
      .then((canvas) => {
        downloadCanvasAsPng(
          canvas,
          `${this.props.title.replace(/\s+/g, "_").toLowerCase()}.png`
        );
      })
      .catch((error) => {
        message.error(this.props.t("general.error", { error }));
      });
  };

  render() {
    const {
      t,
      loading,
      title,
      missingFiles,
      filename,
      filenameIndex,
      format,
      name,
      inViewport,
      renderOutsideViewPort,
      visible,
      error,
      domains,
      chromoBins,
      dataset,
      id,
    } = this.props;

    let url = `${dataset.dataPath}${id}/${filename}`;
    let indexURL = `${dataset.dataPath}${id}/${filenameIndex}`;

    return (
      <Wrapper visible={visible}>
        {error ? (
          <ErrorPanel
            avatar={<img src={logo} alt="logo" height={16} />}
            header={
              <Space>
                <span className="ant-pro-menu-item-title">
                  {title || t("components.igv-panel.title")}
                </span>
                <span>{domainsToLocation(chromoBins, domains)}</span>
              </Space>
            }
            title={t("components.igv-panel.error.title")}
            subtitle={t("components.igv-panel.error.subtitle", {
              filename: missingFiles.join(", "),
            })}
            explanationTitle={t(
              "components.genome-panel.error.explanation.title"
            )}
            explanationDescription={error}
          />
        ) : (
          <Skeleton active loading={loading}>
            <Card
              style={transitionStyle(inViewport || renderOutsideViewPort)}
              loading={loading}
              size="small"
              title={
                <Space>
                  <span role="img" className="anticon anticon-dashboard">
                    <img src={logo} alt="logo" height={16} />
                  </span>
                  <span className="ant-pro-menu-item-title">
                    <Space>
                      <span className="ant-pro-menu-item-title">
                        {title || t("components.igv-panel.title")}
                      </span>
                      <span>{domainsToLocation(chromoBins, domains)}</span>
                    </Space>
                  </span>
                </Space>
              }
              extra={
                <Space>
                  <Tooltip title={t("components.download-as-png-tooltip")}>
                    <Button
                      type="default"
                      shape="circle"
                      disabled={!visible}
                      icon={<AiOutlineDownload style={{ marginTop: 4 }} />}
                      size="small"
                      onClick={() => this.onDownloadButtonClicked()}
                    />
                  </Tooltip>
                </Space>
              }
            >
              {visible && (
                <div
                  className="ant-wrapper"
                  ref={(elem) => (this.container = elem)}
                >
                  {(inViewport || renderOutsideViewPort) && (
                    <Row gutter={[margins.gap, 0]}>
                      <Col flex={1}>
                        <IgvPlot {...{ url, indexURL, format, name }} />
                      </Col>
                    </Row>
                  )}
                </div>
              )}
            </Card>
          </Skeleton>
        )}
      </Wrapper>
    );
  }
}
IgvPanel.propTypes = {};
IgvPanel.defaultProps = {
  visible: true,
};
const mapDispatchToProps = () => ({});
const mapStateToProps = (state) => ({
  renderOutsideViewPort: state.App.renderOutsideViewPort,
  domains: state.Settings.domains,
  chromoBins: state.Settings.chromoBins,
  dataset: state.Settings.dataset,
  id: state.CaseReport.id,
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withTranslation("common")(handleViewport(IgvPanel, { rootMargin: "-1.0px" }))
);