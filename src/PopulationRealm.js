import React from "react";
import Highcharts from 'highcharts'
import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsReact from 'highcharts-react-official'
import {class_colors, professions_colors} from "./Interfaces";

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts)
}

/**
 * @param series [{_id: string, value: number}]
 * @param x_axis [number]
 * @param type {string}
 * @returns {JSX.Element}
 * @constructor
 */

export default function PopulationRealm({series, x_axis, type}) {

  if (!Array.isArray(series) || series.length === 0) return <div>Population data are not available</div>
  if (!Array.isArray(x_axis) || x_axis.length === 0) return <div>Population data are not available</div>

  let Map, Title;

  if (type === 'characters_classes') {
    Title = 'Realm population by class'
    Map = class_colors;
  }

  if (type === 'characters_professions') {
    Title = 'Realm population by profession'
    Map = professions_colors
  }

  if (type === 'characters_covenants') {

  }

  const dataset = series.map(({_id, value}) => ({
    name: _id,
    data: value,
    color: Map.get(_id)
  }))

  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType={'chart'}
      options={{
        chart: {
          type: 'area',
          height: (9 / 16 * 100) + '%',
          backgroundColor: 'transparent',
        },
        title: {
          text: Title,
          style: {
            fontFamily: 'Fira Sans',
            textTransform: 'uppercase'
          }
        },
        xAxis: {
          categories: x_axis.map(t => new Date(t)),
          title: {
            enabled: true
          },
          labels: {
            formatter: function () {
              return Highcharts.dateFormat("%e.%b", this.value);
            }
          },
        },
        yAxis: {
          labels: {
            format: '{value}%'
          },
          title: {
            enabled: false
          }
        },
        tooltip: {
          pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f})<br/>',
          split: true,
          backgroundColor: 'transparent'
        },
        plotOptions: {
          area: {
            stacking: 'percent',
          }
        },
        series: dataset
      }}
    />
  )
}
