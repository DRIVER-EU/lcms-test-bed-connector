import { Drawing } from "declarations/lcms-api-schema";
import { INamedGeoJSON } from ".";
import { Part } from "./lcms";

export interface DrawingObject {
    drawing: DrawingType,
    drawingType: string,
    status: string
};

export interface DrawingType {
    [key: string]: any;
}

export const drawingsToGeoJSONCollection = (drawings: Drawing[]) => {
    let col: { [key: string]: INamedGeoJSON } = {};
    drawings.forEach((d: DrawingType, drawingIndex: number) => {
        let drawingCollection = drawingToGeoJSONCollection(d.drawing, drawingIndex + 1);
        col = Object.assign(col, drawingCollection);
    });
    return col;
}

export const drawingToGeoJSONCollection = (drawing: DrawingType, drawingIndex: number) => {
    let col: { [key: string]: INamedGeoJSON } = {};
    drawing.topicLayers.forEach((tl: any) => {
        if (!tl.id) return;
        const layerTitle = `LCMS: ${tl.name || tl.id} (${drawingIndex})`;
        let geoJson: INamedGeoJSON = {
            properties: {
                guid: tl.id,
                name: layerTitle
            },
            geojson: {
                type: 'FeatureCollection',
                features: []
            }
        };
        col[layerTitle] = geoJson;
        let features = geoJson.geojson.features;
        tl.actionLayers.forEach((al: any) => {
            if (!al.elements) return;
            al.elements.forEach((el: any) => {
                if (el instanceof Part && el.children) {
                    el.children.forEach(c => {
                        if (c instanceof Part && c.children) {
                            c.children.forEach((cc: any) => {
                                let feature = cc.toGeoJSONFeature();
                                if (feature) features.push(feature);
                            });
                        } else {
                            let feature = c.toGeoJSONFeature();
                            if (feature) features.push(feature);
                        }
                    });
                } else {
                    let feature = el.toGeoJSONFeature();
                    if (feature) features.push(feature);
                }
            });
        });
    });
    console.log(JSON.stringify(col));
    return col;
}