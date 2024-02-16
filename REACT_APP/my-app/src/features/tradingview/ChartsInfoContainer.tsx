import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import {
    stateCharts, stateSymbolInfos
} from './chartSlice';

import ChartCards from './ChartCards';
import internal from 'stream';

interface ChartObj {
    key?: string;
    chartID?: string;
    full_name?: string;
    candleData?: any; // Assuming posts is an array of strings
    duUpdates?: any;
    interval?: any;
    latestDuUpdate?: any;
};
interface ChartCardsProps {
    chart_objs: ChartObj[]; // Assuming ChartObj is the interface representing the data structure
};

export default function ChartsInfoContainer() {
    const charts = useAppSelector(stateCharts);
    const symbolInfos = useAppSelector(stateSymbolInfos);

    const [chart_objs, setChart_objs] = useState<ChartObj[]>([]);



    useEffect(() => {//#TODO fix?, ChartCard does not render until there is a duUpdate WS message(live price update)
        let chart_names = Object.keys(charts);
        let symbolInfos_keys = Object.keys(symbolInfos);
        console.log("ChartsInfoContainer loaded? heres charts useAppSelector: ", { charts, chart_names });
        try {
            if (charts && chart_names.length > 0 && symbolInfos_keys.length > 0) {
                // console.log(">>> useEffect Handling state changes...", { charts, chart_names });
                var x_array: any = [];
                chart_names.forEach(name => {
                    let study_keys = Object.keys(charts[name]);
                    console.log({ study_keys });

                    if (study_keys && study_keys.length > 0) {
                        study_keys.forEach(sds_x => {
                            let item = charts[name][sds_x];
                            let sx_keys = Object.keys(item);
                            console.log({ item, name, sds_x, sx_keys });

                            if (sx_keys.length > 0) {
                                sx_keys.forEach(sx => {
                                    let sx_data = charts[name][sds_x][sx];

                                    try {
                                        let seriesSymbolInfoName = sx_data.seriesSymbolInfoName_sds_sym_x;

                                        let seriesCandleInterval = sx_data.seriesCandleInterval;

                                        let sym_data = symbolInfos[name][seriesSymbolInfoName];
                                        if (sym_data) {
                                            let full_name = sym_data.data.full_name;

                                            let candleData = sx_data.seriesCandleData;

                                            let duUpdates = sx_data.duUpdates;

                                            if (duUpdates) {
                                                let keys = Object.keys(duUpdates);
                                                let latestDuUpdate = {};

                                                if (duUpdates && keys.length > 0) {
                                                    let lastKey = keys[keys.length - 1];
                                                    latestDuUpdate = duUpdates[lastKey];
                                                }


                                                let key = `${name}~>${sds_x}~>${sx}`;
                                                let chartID = `${full_name}~>${seriesCandleInterval}`;
                                                let data_obj = { key,chartID, full_name, interval: seriesCandleInterval, candleData, duUpdates, latestDuUpdate };
                                                x_array.push(data_obj);
                                                console.log(`--->>> full_name:${full_name}`, { data_obj });
                                                // console.log(`--->>> full_name:${full_name}, interval:${seriesCandleInterval}`, { sx_data, seriesSymbolInfoName, sym_data });    
                                            }    
                                        }

                                    } catch (error) {
                                        console.warn("ChartsInfoContainer  sx_keys.forEach error", { sx_data, symbolInfos, charts }, error);
                                    }

                                });
                            }

                        });

                    }
                });
                setChart_objs(x_array)
            }
        } catch (error) {
            console.warn("ChartsInfoContainer error: ", error);
        }
        // return () => {
        //     null;
        // };
    }, [charts, symbolInfos]);





    return (
        <div>
            <h2 style={{ textDecorationLine: "underline" }}>ChartsInfoContainer <button>Do something to all tickers</button></h2>
            <ChartCards chart_objs={chart_objs} />
        </div>
    );
};