import React from "react";
import Highcharts from 'highcharts'
import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsReact from 'highcharts-react-official'

if (typeof Highcharts === 'object') {
    HighchartsExporting(Highcharts)
}

export default function LineChart ({data}) {
    if (!data || !data.length) return ('')
    let priceArray = [], oiArray = [], quantityArray = [], dateArray = [];
    data.map(({price, open_interest, quantity, last_modified}) => {
        priceArray.push(price)
        oiArray.push(open_interest)
        quantityArray.push(quantity)
        dateArray.push(new Date(last_modified*1000))
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
                },
                yAxis: [
                    {
                        labels: {
                            format: '{value}g',
                        },
                        title: {
                            text: 'Price',
                        }
                    },
                    {
                        title: {
                            text: null,
                        },
                        labels: {
                            enabled: false
                        },
                        opposite: true
                    },
                    {
                        title: {
                            text: 'Open Interest',
                        },
                        labels: {
                            formatter: function() {
                                return this.value.toLocaleString('ru-RU');
                            }
                        },
                        opposite: true
                    }
                ],
                title: {
                    text: ''
                },
                series: [
                    { name: 'Open Interest', type: 'column', data: oiArray, yAxis: 2, opacity: 0.75, color: '#89858c' },
                    { name: 'Quantity', type: 'column', data: quantityArray, yAxis: 1, opacity: 0.75, color: '#c1aa82' },
                    { name: 'Price', data: priceArray, color: '#241c18' }
                ],
                xAxis: {
                    categories: dateArray,
                    type: "datetime",
                    labels: {
                        step: 24,
                        formatter: function () {
                            return Highcharts.dateFormat("%e.%b", this.value);
                        }
                    },
                },
            }}
        />
    )
}
