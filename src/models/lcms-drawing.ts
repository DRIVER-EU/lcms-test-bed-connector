import { TopicLayer } from './lcms-topic-layer';
import * as LCMS from './lcms';
import { INamedGeoJSON } from './named-geojson';
import { ActionLayer } from './lcms-action-layer';

export class LcmsDrawing {
    public map: { [key: string]: TopicLayer } = {};

    constructor(public topicLayers: TopicLayer[], public name: string, public id: string, public starttime: number, public lastchange: number, public projection: string) { }

    public static fromObject(d: LcmsDrawing) {
        let drawing = new LcmsDrawing(d.topicLayers, d.name, d.id, d.starttime, d.lastchange, d.projection);
        drawing.topicLayers = d.topicLayers.map(tl => {
            return TopicLayer.fromObject(tl);
        });
        let tlMap: { [key: string]: TopicLayer } = {};
        drawing.topicLayers.forEach(tl => (tlMap[tl.id] = tl));
        drawing.map = tlMap;
        return drawing;
    }

    /**
     * Export to a GeoJSON collection, i.e. an object where each key points to a GeoJSON object.
     *
     * @param {string} [folder]
     *
     * @memberOf LcmsDrawing
     */
    public toGeoJSONCollection(drawingIndex: number) {
        let col: { [key: string]: INamedGeoJSON } = {};
        this.topicLayers.forEach((tl: any) => {
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
            tl.actionLayers.forEach((al: ActionLayer) => {
                if (!al.elements) return;
                al.elements.forEach((el: LCMS.AElement) => {
                    if (el instanceof LCMS.Part && el.children) {
                        el.children.forEach(c => {
                            if (c instanceof LCMS.Part && c.children) {
                                c.children.forEach((cc: LCMS.AElement) => {
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
}
