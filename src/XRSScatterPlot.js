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
        if (!realmsMap.has(connected_realm_id)) {
            realmsMap.set(connected_realm_id, iterator);
            iterator = iterator + 1;
        }
        return [realmsMap.get(connected_realm_id), value, connected_realm_id, name, flag, type]
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
                        text: 'Test'
                    }
                },
                colorAxis: {
                    min: 0,
                    minColor: '#ebe7ee',
                    maxColor: '#241c18'
                },
                legend: {
                    align: 'right',
                    layout: 'vertical',
                    margin: 0,
                    verticalAlign: 'middle',
                    y: 25,
                    symbolHeight: 350
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
                            headerFormat: '<b>{series.value}</b><br>',
                            pointFormat: '{point.type}\n{point.flag}'
                        }
                    }
                },
                series: [{
                    keys: ['x', 'y', 'realm', 'name', 'flag', 'type'],
                    data: ScatterPlotData,
                }]
            }}
        />
    )
};