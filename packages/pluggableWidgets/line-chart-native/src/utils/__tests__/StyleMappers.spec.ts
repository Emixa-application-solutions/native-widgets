import { mapToAxisStyle, mapToGridStyle, mapToLineStyle, mapToMarkerStyle } from "../StyleMappers";
import { LineChartAxisStyle, LineChartLineStyle } from "../../ui/Styles";

describe("StyleMappers", () => {
    describe("mapToGridStyle", () => {
        it("maps the relevant styles", () => {
            const gridStyle = {
                backgroundColor: "orange",
                color: "transparent",
                dashArray: "5,5",
                paddingBottom: 30,
                paddingLeft: 30,
                paddingRight: 10,
                paddingTop: 10,
                width: 10
            };

            const expectedResult = {
                background: {
                    fill: gridStyle?.backgroundColor
                }
            };

            expect(mapToGridStyle(gridStyle)).toStrictEqual(expectedResult);
        });
    });

    describe("mapToAxisStyle", () => {
        it("maps the relevant styles", () => {
            const gridStyle = {
                backgroundColor: "orange",
                color: "transparent",
                dashArray: "5,5",
                paddingBottom: 30,
                paddingLeft: 30,
                paddingRight: 10,
                paddingTop: 10,
                width: 10
            };

            const axisStyle: LineChartAxisStyle<"Y"> = {
                color: "green",
                dashArray: "10,10",
                fontFamily: "Times New Roman",
                fontSize: 20,
                fontStyle: "italic",
                fontWeight: "100",
                label: {
                    relativePositionGrid: "left",
                    alignSelf: "center"
                },
                width: 5
            };

            const expectedResult = {
                axis: {
                    stroke: axisStyle?.color,
                    strokeDasharray: axisStyle?.dashArray,
                    strokeWidth: axisStyle?.width
                },
                grid: {
                    stroke: gridStyle?.color,
                    strokeDasharray: gridStyle?.dashArray,
                    strokeWidth: gridStyle?.width
                },
                tickLabels: {
                    fontFamily: axisStyle?.fontFamily,
                    fontSize: axisStyle?.fontSize,
                    fontStyle: axisStyle?.fontStyle,
                    fontWeight: axisStyle?.fontWeight
                }
            };

            expect(mapToAxisStyle(gridStyle, axisStyle)).toStrictEqual(expectedResult);
        });
    });

    describe("mapToLineStyle", () => {
        it("maps the relevant styles", () => {
            const lineStyle: LineChartLineStyle["line"] = {
                color: "rgba(255,0,0,0.3)",
                dashArray: "10,3",
                ending: "flat",
                width: 15
            };

            const expectedResult = {
                data: {
                    stroke: lineStyle?.color,
                    strokeDasharray: lineStyle?.dashArray,
                    strokeLinecap: lineStyle?.ending,
                    strokeWidth: lineStyle?.width
                }
            };

            expect(mapToLineStyle(lineStyle)).toStrictEqual(expectedResult);
        });
    });

    describe("mapToMarkerStyle", () => {
        it("maps the relevant styles", () => {
            const markersStyle: LineChartLineStyle["markers"] = {
                backgroundColor: "rgba(255,0,255,0.3)",
                borderColor: "red",
                borderWidth: 3,
                display: "onTop",
                size: 10,
                symbol: "diamond"
            };

            const expectedResult = {
                data: {
                    fill: markersStyle?.backgroundColor,
                    stroke: markersStyle?.borderColor,
                    strokeWidth: markersStyle?.borderWidth
                }
            };

            expect(mapToMarkerStyle(markersStyle)).toStrictEqual(expectedResult);
        });
    });
});
