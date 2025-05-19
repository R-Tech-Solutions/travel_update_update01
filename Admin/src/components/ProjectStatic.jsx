import React, { useEffect } from "react";

const ProjectStatic = () => {
    const options = {
        xaxis: {
            show: true,
            categories: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
            labels: {
                show: true,
                style: {
                    fontFamily: "Inter, sans-serif",
                    cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
                }
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        yaxis: {
            show: true,
            labels: {
                show: true,
                style: {
                    fontFamily: "Inter, sans-serif",
                    cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
                },
                formatter: function (value) {
                    return '$' + value;
                }
            }
        },
        series: [
            {
                name: "Developer Edition",
                data: [150, 141, 145, 152, 135, 125],
                color: "#1A56DB",
            },
            {
                name: "Designer Edition",
                data: [43, 13, 65, 12, 42, 73],
                color: "#7E3BF2",
            },
        ],
        chart: {
            sparkline: {
                enabled: false
            },
            height: 200,  // Fixed height
            width: "100%",
            type: "area",
            fontFamily: "Inter, sans-serif",
            dropShadow: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
        },
        tooltip: {
            enabled: true,
            x: {
                show: false,
            },
        },
        fill: {
            type: "gradient",
            gradient: {
                opacityFrom: 0.55,
                opacityTo: 0,
                shade: "#1C64F2",
                gradientToColors: ["#1C64F2"],
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            width: 2,  // Reduced stroke width
        },
        legend: {
            show: false
        },
        grid: {
            show: false,
        },
    };

    useEffect(() => {
        if (typeof ApexCharts !== 'undefined') {
            const chart = new ApexCharts(document.getElementById("labels-chart"), options);
            chart.render();

            return () => {
                chart.destroy();
            };
        }
    }, []);

    return (
        <div className="h-full">  {/* Added h-full */}
            <div className="w-full bg-white rounded-xl dark:bg-gray-800 h-full flex flex-col">  {/* Added flex classes */}
                <div className="flex justify-between p-4 md:p-6 pb-0 md:pb-0">
                    <div>
                        <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">
                            $12,423
                        </h5>
                    </div>
                    <div className="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500 dark:text-green-500 text-center">
                        23%
                        <svg
                            className="w-3 h-3 ms-1"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 10 14"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13V1m0 0L1 5m4-4 4 4"
                            />
                        </svg>
                    </div>
                </div>
                <div id="labels-chart" className="px-2.5 flex-grow min-h-[200px]"></div>  {/* Added flex-grow and min-h */}
            </div>
        </div>
    );
};

export default ProjectStatic;