import React from "react";
import Highcharts from 'highcharts'
import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsReact from 'highcharts-react-official'
import HC_heatmap from "highcharts/modules/heatmap";

if (typeof Highcharts === 'object') {
  HC_heatmap(Highcharts);
  HighchartsExporting(Highcharts)
}

export default function ClusterChart({data, xrs}) {
  if (!data) return ('')

  const {y_axis, x_axis, dataset} = data;

  let xAxis;

  if (!xrs) xAxis = x_axis.map(t => (new Date(parseFloat(t) * 1000)).toLocaleString('ru-RU'));
  if (xrs) xAxis = x_axis

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
          categories: xAxis,
        },
        yAxis: {
          categories: y_axis,
          labels: {
            formatter: function () {
              return this.value.toFixed(2);
            }
          },
          tickLength: 150,
          opposite: false,
          title: null,
        },
        colorAxis: {
          min: 0,
          minColor: 'rgba(167,167,167,0.1)',
          maxColor: 'rgba(167,167,167,1)'
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
            return `T: ${this.series.xAxis.categories[this.point.x]}<br>
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
            shadow: true,
            formatter: function () {
              if (this.point.value !== 0) {
                return this.point.value.toLocaleString('ru-RU');
              }
            },
            style: {
              fontFamily: 'Roboto',
              color: '#242424',
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
