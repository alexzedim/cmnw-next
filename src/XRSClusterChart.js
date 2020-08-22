import React from "react";
import Highcharts from 'highcharts/highstock';
import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsReact from 'highcharts-react-official'
import HC_heatmap from "highcharts/modules/heatmap";

if (typeof Highcharts === 'object') {
    HC_heatmap(Highcharts);
    HighchartsExporting(Highcharts)
}

export default function XRSClusterChart ({data}) {
    if (!data) return ('')

    const { price_range, realms, dataset } = data;

    let connected_realm = realms.map(({connected_realms}) => connected_realms.map(({name_locale}) => name_locale).join(', '));

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
                plotOptions: {
                    series: {
                        turboThreshold: 0,
                        boostThreshold: 100,
                        dataLabels: {
                            overflow: 'none',
                            crop: true,
                            enabled: true,
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
                    }
                },
                boost: {
                    useGPUTranslations: true,
                    usePreallocated: true,
                },
                title: {
                    text: undefined
                },
                xAxis: {
                    startOnTick: false,
                    endOnTick: false,
                    categories: connected_realm,
                    title: null,
                    min: 0,
                    max: 20,
                    scrollbar: {
                        enabled: true
                    },
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
                        return `Realms: ${this.series.xAxis.categories[this.point.x]}<br>
                            Q: ${(this.point.value).toLocaleString('ru-RU')}<br>
                            P: ${this.series.yAxis.categories[this.point.y]}+<br>
                            O: ${this.point.orders}<br>
                            OI: ${parseInt(this.point.oi).toLocaleString('ru-RU')}`
                    }
                },
                series: [{
                    borderWidth: 0,
                    data: dataset,
                    dataLabels: {
                        enabled: true,
                    }
                }]
            }}
        />
    )
};
