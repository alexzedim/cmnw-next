import React from "react";
import Highcharts from 'highcharts'
import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsReact from 'highcharts-react-official'
import HC_heatmap from "highcharts/modules/heatmap";

if (typeof Highcharts === 'object') {
    HC_heatmap(Highcharts);
    HighchartsExporting(Highcharts)
}

export default function XRSClusterChart ({data}) {
    if (!data) return <div>No records available</div>

    const { price_range, realms, dataset } = data;

    return (
        <HighchartsReact
            highcharts={Highcharts}
            constructorType={'chart'}
            options={{
                chart: {
                    type: 'heatmap',
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
                    categories: realms.map(({connected_realms}) => `
                    ${new Date(connected_realms[0].auctions*1000).toLocaleString('ru-RU')}
                    ${connected_realms.map(r => r.name)}
                    `),
                },
                yAxis:{
                    categories: price_range,
                    tickLength: 150,
                    opposite: false ,
                    title: null,
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
                tooltip: {
                    formatter: function () {
                        return `Time & Realms: ${this.series.xAxis.categories[this.point.x]}<br>
                        Q: ${(this.point.value).toLocaleString('ru-RU')}<br>
                        P: ${this.series.yAxis.categories[this.point.y]}+<br>
                        O: ${this.point.orders}<br>
                        OI: ${parseInt(this.point.oi).toLocaleString('ru-RU')}`
                    }
                },
                series: [{
                    borderWidth: 0,
                    clip: false,
                    data: dataset,
                    dataLabels: {
                        enabled: true,
                        crop: true,
                        shadow: false,
                        formatter: function(){
                            if (this.point.value !== 0) {
                                return this.point.value.toLocaleString('ru-RU');
                            }
                        },
                        style: {
                            fontFamily: 'Roboto',
                            color: 'contrast',
                            fontSize: '14px',
                            fontWeight: 'normal',
                            textOutline: '0px',
                        }
                    }
                }]
            }}
        />
    )
};