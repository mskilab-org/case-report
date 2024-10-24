import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Skeleton, Affix, Segmented, Space } from "antd";
import * as d3 from "d3";
import BarPlotPanel from "../../components/barPlotPanel";
import PopulationPanel from "../../components/populationPanel";
import { mutationFilterTypes } from "../../helpers/utility";
import Wrapper from "./index.style";

class SignaturesTab extends Component {
  state = {
    signatureKPIMode: "total",
    signatureFractionMode: "count",
    signatureDistributionMode: "population",
    mutationFilter: "sbs",
  };

  handleSignatureKPIsTumourSegmentedChange = (signatureKPIMode) => {
    this.setState({ signatureKPIMode });
  };

  handleSignatureKPIsFractionSegmentedChange = (signatureFractionMode) => {
    this.setState({ signatureFractionMode });
  };

  handleSignatureDistributionModeSegmentedChange = (
    signatureDistributionMode
  ) => {
    this.setState({ signatureDistributionMode });
  };

  handleMutationCatalogSegmentedChange = (mutationFilter) => {
    this.setState({ mutationFilter });
  };

  render() {
    const {
      t,
      loading,
      metadata,
      mutationsColorPalette,
      mutationCatalog,
      decomposedCatalog,
      referenceCatalog,
      signaturePlots,
      signatureTumorPlots,
    } = this.props;
    const {
      signatureKPIMode,
      signatureFractionMode,
      signatureDistributionMode,
      mutationFilter,
    } = this.state;
    let colorPalette = mutationsColorPalette
      ? Object.fromEntries(
          (mutationFilterTypes()[mutationFilter] || []).map((key) => [
            key,
            mutationsColorPalette[key],
          ])
        )
      : {};
    let legendPaletteTitles = mutationsColorPalette
      ? Object.fromEntries(
          (mutationFilterTypes()[mutationFilter] || []).map((key) => [
            key,
            t(`metadata.mutation-catalog-titles.${key}`),
          ])
        )
      : {};
    let catalog = mutationCatalog.filter(
      (d) => d.variantType === mutationFilter
    );

    return (
      <Wrapper>
        <Skeleton active loading={loading}>
          <Affix offsetTop={194}>
            <BarPlotPanel
              loading={loading}
              dataPoints={catalog}
              title={t("components.mutation-catalog-panel.title")}
              legendTitle={t("metadata.mutation-type")}
              xTitle={""}
              xVariable={"type"}
              xFormat={null}
              yTitle={t("components.mutation-catalog-panel.y-title")}
              yVariable={"mutations"}
              yFormat={"~s"}
              colorVariable={"mutationType"}
              colorPalette={colorPalette}
              legendTitles={legendPaletteTitles}
              segmentedOptions={Object.keys(mutationFilterTypes()).map((d) => {
                return {
                  label: t(
                    `components.mutation-catalog-panel.segmented-filter.${d}`
                  ),
                  value: d,
                };
              })}
              segmentedValue={mutationFilter}
              handleSegmentedChange={this.handleMutationCatalogSegmentedChange}
            />
          </Affix>
          <br />
          <Space>
            <Segmented
              options={[
                {
                  label: t("components.segmented-filter.total"),
                  value: "total",
                },
                {
                  label: t("components.segmented-filter.tumor", {
                    tumor: metadata.tumor,
                  }),
                  value: "byTumor",
                },
              ]}
              onChange={(d) => this.handleSignatureKPIsTumourSegmentedChange(d)}
              value={signatureKPIMode}
            />
            <Segmented
              options={[
                {
                  label: t("components.segmented-filter.fraction"),
                  value: "fraction",
                },
                {
                  label: t("components.segmented-filter.count"),
                  value: "count",
                },
              ]}
              onChange={(d) =>
                this.handleSignatureKPIsFractionSegmentedChange(d)
              }
              value={signatureFractionMode}
            />
            <Segmented
              options={[
                {
                  label: t("components.segmented-filter.population-mode"),
                  value: "population",
                },
                {
                  label: t("components.segmented-filter.decomposed-mode"),
                  value: "decomposed",
                },
              ]}
              onChange={(d) =>
                this.handleSignatureDistributionModeSegmentedChange(d)
              }
              value={signatureDistributionMode}
            />
          </Space>

          {signatureDistributionMode === "decomposed" && (
            <Space
              direction="vertical"
              size="middle"
              style={{
                display: "flex",
              }}
            >
              <br />
              {decomposedCatalog
                .filter((d) => d.variantType === mutationFilter)
                .sort((a, b) =>
                  d3.descending(
                    d3.sum(a.catalog, (d) => d.mutations),
                    d3.sum(b.catalog, (d) => d.mutations)
                  )
                )
                .map((d, i) => (
                  <BarPlotPanel
                    key={`decomposed-${i}`}
                    loading={loading}
                    dataPoints={d.catalog}
                    referenceDataPoints={
                      referenceCatalog.find((e) => e.id === d.id).catalog
                    }
                    title={
                      <Space>
                        <span>
                          {t("components.mutation-catalog-panel.title")}
                        </span>
                        <span>{d.id}</span>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: t(`general.mutation`, {
                              count: d3.sum(d.catalog, (d) => d.mutations),
                            }),
                          }}
                        />
                      </Space>
                    }
                    legendTitle={t("metadata.mutation-type")}
                    xTitle={""}
                    xVariable={"type"}
                    xFormat={null}
                    yTitle={t("components.mutation-catalog-panel.y-title")}
                    yVariable={"mutations"}
                    yFormat={"~s"}
                    colorVariable={"mutationType"}
                    colorPalette={colorPalette}
                    legendTitles={legendPaletteTitles}
                    segmentedOptions={Object.keys(mutationFilterTypes()).map(
                      (d) => {
                        return {
                          label: t(
                            `components.mutation-catalog-panel.segmented-filter.${d}`
                          ),
                          value: d,
                        };
                      }
                    )}
                    segmentedValue={mutationFilter}
                    handleSegmentedChange={
                      this.handleMutationCatalogSegmentedChange
                    }
                  />
                ))}
            </Space>
          )}

          {signatureDistributionMode === "population" && (
            <Space
              direction="vertical"
              size="middle"
              style={{
                display: "flex",
              }}
            >
              <PopulationPanel
                {...{
                  loading,
                  metadata,
                  plots: signaturePlots[mutationFilter][signatureFractionMode],
                  visible: signatureKPIMode === "total",
                  scope: "signatures",
                }}
              />
              <PopulationPanel
                {...{
                  loading,
                  metadata,
                  plots:
                    signatureTumorPlots[mutationFilter][signatureFractionMode],
                  visible: signatureKPIMode === "byTumor",
                  scope: "signatures",
                }}
              />
            </Space>
          )}
        </Skeleton>
      </Wrapper>
    );
  }
}
SignaturesTab.propTypes = {};
SignaturesTab.defaultProps = {};
const mapDispatchToProps = (dispatch) => ({});
const mapStateToProps = (state) => ({
  loading: state.SignatureStatistics.loading,
  metadata: state.CaseReport.metadata,
  mutationsColorPalette: state.Settings.data?.mutationsColorPalette,
  mutationCatalog: state.SignatureStatistics.mutationCatalog,
  decomposedCatalog: state.SignatureStatistics.decomposedCatalog,
  referenceCatalog: state.SignatureStatistics.referenceCatalog,
  signaturePlots: state.SignatureStatistics.signatureMetrics,
  signatureTumorPlots: state.SignatureStatistics.tumorSignatureMetrics,
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("common")(SignaturesTab));
