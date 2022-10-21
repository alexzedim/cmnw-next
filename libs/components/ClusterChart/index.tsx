import { FC, Fragment } from 'react';
import { LinearProgress, Box } from '@mui/material';
import useSWR from 'swr';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsExporting from 'highcharts/modules/exporting';
import Heatmap from 'highcharts/modules/heatmap';
import { itemQuery, chartResponse } from '../../types';
import { DOMAINS } from '../../constants';
import { theme } from '../../styles';

if (typeof Highcharts === 'object') {
  Heatmap(Highcharts);
  HighchartsExporting(Highcharts)
}

const styleCss = {
  root: {
    padding: theme.spacing(2),
    borderRadius: '15px',
    position: 'relative',
  },
  border: {
    color: 'white',
    padding: '1rem',
    border: 'solid 15px rgba(167,167,167,1)',
  },
};

const ClusterChart: FC<itemQuery> = ({ id, is_commdty }) => {

  if (!is_commdty) return <></>

  const { data, error } = useSWR<chartResponse>(`${DOMAINS.domain}/api/dma/item/chart?_id=${id}`, (url) => fetch(url).then(r => r.json()));

  if (error) return <div>failed to load</div>
  if (!data) return <LinearProgress />

  return (
    <Fragment>
      <Box sx={styleCss.root}>
        <Box sx={styleCss.border}>
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
                  paddingRight: '16px',
                }
              },
              title: {
                text: undefined
              },
              xAxis: {
                categories: data.xAxis,
                labels: {
                  formatter: function () {
                    if (typeof this.value === 'number') return new Date(this.value).toLocaleString('ru-RU');
                    return this.value;
                  }
                }
              },
              yAxis: {
                categories: data.yAxis,
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
                  return `${typeof this.series.xAxis.categories[this.point.x] === 'number' ? new Date(this.series.xAxis.categories[this.point.x]).toLocaleString('ru-RU'): this.series.xAxis.categories[this.point.x]}<br>Quantity: ${(this.point.value).toLocaleString('ru-RU')}<br>Price: ${this.series.yAxis.categories[this.point.y]}<br>Orders: ${this.point.orders}<br>Open Interest: ${parseInt(this.point.oi).toLocaleString('ru-RU')}`
                }
              },
              series: [{
                borderWidth: 0,
                clip: false,
                data: data.dataset,
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
                    fontFamily: 'Fira Sans',
                    color: '#242424',
                    fontSize: '16px',
                    fontWeight: 'normal',
                    textOutline: '0px',
                  }
                }
              }]
            }}
          />
        </Box>
      </Box>
    </Fragment>
  )
}

export default ClusterChart;
