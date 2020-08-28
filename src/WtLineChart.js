import React from "react";
import Highcharts from 'highcharts'
import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsReact from 'highcharts-react-official'

if (typeof Highcharts === 'object') {
    HighchartsExporting(Highcharts)
}

export default function WtLineChart ({data}) {
    if (!data || !data.length) return ('')
    let dateArray = [], priceArray = [];

    data.sort((a, b) => a._id - b._id).map(({price, _id}) => {
        dateArray.push(_id);
        priceArray.push(price)
    })

    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={{
                chart: {
                    type: 'line',
                    marginTop: 40,
                    marginBottom: 120,
                    height: (9 / 16 * 50) + '%',
                    backgroundColor: 'transparent',
                    zoomType: 'xy'
                },
                title: {
                    text: ''
                },
                legend: {
                    enabled: false,
                },
                series: [{
                    data: priceArray,
                }],
                plotOptions: {
                    line: {
                        dataLabels: {
                            color: '#241c18',
                            enabled: true
                        },
                        enableMouseTracking: false,
                        color: '#c1aa82',
                    }
                },
                xAxis: {
                    categories: dateArray,
                    type: "datetime",
                    labels: {
                        step: 10,
                        formatter: function () {
                            return Highcharts.dateFormat("%e.%b", this.value);
                        }
                    },
                },
            }}
        />
    )
}
