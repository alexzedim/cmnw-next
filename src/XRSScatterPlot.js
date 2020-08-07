import React from "react";
import Highcharts from 'highcharts'
import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsReact from 'highcharts-react-official'

if (typeof Highcharts === 'object') {
    HighchartsExporting(Highcharts)
}

export default function XRSScatterPlot ({data}) {
    if (!data) return <div>No records available</div>

    const realmsMap = new Map();
    let iterator = 0;

    /** Define scatter plot data and realmMap for xAxis */
    let ScatterPlotData = data.map(({connected_realm_id, value, name, flag, type}) => {
        let color;
        if (flag === 'SELL') {
            color = '#BA0F30'
        } else {
            color = '#18a558'
        }
        if (type === 'DERIVATIVE') {
            color = '#21b6a8'
        }
        if (type === 'PREMIUM') {
            color = '#FC3C80'
        }
        if (!realmsMap.has(connected_realm_id)) {
            realmsMap.set(connected_realm_id, iterator);
            iterator = iterator + 1;
        }
        return [realmsMap.get(connected_realm_id), value, color, connected_realm_id, name, flag, type]
    })

    /** Define xAxis names */
    let xAxis = Array.from(realmsMap.keys())

    return (
        <HighchartsReact
            highcharts={Highcharts}
            constructorType={'chart'}
            options={{
                chart: {
                    type: 'scatter',
                    plotBorderWidth: 1,
                    height: (9 / 16 * 100) + '%',
                    backgroundColor: 'transparent',
                    style: {
                        letterSpacing: 'unset',
                    }
                },
                title: {
                    text: undefined
                },
                xAxis: {
                    categories: xAxis
                },
                yAxis:{
                    title: {
                        text: 'Value'
                    }
                },
                plotOptions: {
                    scatter: {
                        marker: {
                            radius: 5,
                            states: {
                                hover: {
                                    enabled: true,
                                    lineColor: 'rgb(100,100,100)'
                                }
                            }
                        },
                        states: {
                            hover: {
                                marker: {
                                    enabled: false
                                }
                            }
                        },
                        tooltip: {
                            pointFormatter: function () {
                                return `R: ${this.realm}<br>
                                T: ${this.type} || ${this.flag}<br>
                                V: ${(this.y).toLocaleString('ru-RU')}<br>
                                ${this.type === "DERIVATIVE" ? (`N: ${this.name}`) : ("")}`
                            }
                        }
                    }
                },
                series: [{
                    keys: ['x', 'y', 'color', 'realm', 'name', 'flag', 'type'],
                    data: ScatterPlotData,
                    showInLegend: false
                }]
            }}
        />
    )
};