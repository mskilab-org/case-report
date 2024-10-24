import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Space, Result, Typography, Divider } from "antd";
import Wrapper from "./index.style";
import { CloseCircleOutlined } from "@ant-design/icons";

const { Paragraph, Text } = Typography;

class CriticalError extends Component {
  render() {
    const { t, datasetsError, settingsError, datafilesError, dataset } =
      this.props;

    const renderSummary = (error, type, value) => {
      if (!error) return null;
      return (
        <>
          <Paragraph>
            <Text className="site-result-error-title">
              {
                <span
                  dangerouslySetInnerHTML={{
                    __html: t(
                      `pages.error.critical-error.missing-file.${type}`,
                      { value }
                    ),
                  }}
                />
              }
            </Text>
          </Paragraph>
          <Paragraph>
            <Space>
              <CloseCircleOutlined className="site-result-error-icon" />
              {error.stack}
            </Space>
          </Paragraph>
        </>
      );
    };
    return (
      <Wrapper>
        <main className="error-page">
          <section className="error-area padding-top-140px">
            <Result
              status="500"
              title={t("pages.error.critical-error.title")}
              subTitle={t("pages.error.critical-error.subtitle")}
            >
              <div className="desc">
                <Space direction="vertical">
                  {renderSummary(datasetsError, "datasets")}
                  {datasetsError && settingsError && <Divider />}
                  {renderSummary(settingsError, "settings")}
                  {datafilesError && settingsError && <Divider />}
                  {renderSummary(
                    datafilesError,
                    "datafiles",
                    dataset.datafilesPath
                  )}
                </Space>
              </div>
            </Result>
          </section>
        </main>
      </Wrapper>
    );
  }
}

CriticalError.propTypes = {};
CriticalError.defaultProps = {};
const mapDispatchToProps = (dispatch) => ({});
const mapStateToProps = (state) => ({
  datasetsError: state.Datasets.error,
  settingsError: state.Settings.error,
  datafilesError: state.CaseReports.error,
  dataset: state.Settings.dataset,
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("common")(CriticalError));
