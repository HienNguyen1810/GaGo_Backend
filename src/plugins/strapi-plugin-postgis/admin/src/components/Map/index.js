import React, { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import * as turf from '@turf/turf';
import { Searchbar, SearchForm } from "@strapi/design-system/Searchbar"
import { Stack } from '@strapi/design-system/Stack';
import { Box } from '@strapi/design-system/Box';
import { Popover } from '@strapi/design-system/Popover';
import { Button } from '@strapi/design-system/Button';
import { Typography } from '@strapi/design-system/Typography';
import { useRouteMatch } from 'react-router-dom';
import InputJSON from './../InputJSON';
// import InputJSON from '@strapi/admin/admin/src/content-manager/components/InputJSON';
import Landscape from '@strapi/icons/Landscape';
import { useIntl } from 'react-intl';
import * as L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import { useFetchPgMetadata } from "../../hooks/";
import "./leaflet.css";
import getRequestURL from "../../utils/getRequestURL";
import axios from "../../utils/axiosInstance";
import { publish ,subscribe, unsubscribe} from "./event"

const Map = ({ name, onChange, value, intlLabel, disabled, error, description, required, ...props }) => {
    const { formatMessage } = useIntl();
    const pgTables = useFetchPgMetadata()
    const [renderMap, setRenderMap] = useState(undefined)
    const [tableSettings, setTableSettings] = useState(undefined)
    const contentTypeMatch = useRouteMatch(`/content-manager/:kind/:uid`);
    const [searchItems, setSearchItems] = useState([])
    const [searchLocation, setSearchLocation] = useState("")
    const searchVisible= useMemo(() => searchItems.length || searchLocation.length > 0, [searchItems, searchLocation])
    const selectItemEvent = (item) => {
        return
    }
    useEffect(()=>{
        if (searchLocation.length <=0){
            setSearchItems([])
            return;
        }
        const url =getRequestURL("search-geolocation")
        axios.get(url,{
            params:{
                s:searchLocation,
            }
        }).then(res=>{
            setSearchItems(res.data.candidates.map(d=>({
                address:d.formatted_address,
                location:d.geometry.location
            })))
        }).catch(err=>{
            console.log(err);
        })
    },[searchLocation])

    const searchRef = useRef(null)
    const getGeoms = (collection) => {
        let geojsonGeometries = []
        turf.geomEach(collection, function (currentGeometry, featureIndex, featureProperties, featureBBox, featureId) {
            // currentGeometry.coordinates = L.GeoJSON.latLngToCoords(currentGeometry.coordinates)
            geojsonGeometries.push(currentGeometry)
        });
        return geojsonGeometries
    }
    const sanitizeGeojson = (geojson, fieldType) => {
        let inputType = turf.getType(geojson)
        geojson = getGeoms(geojson)
        switch (fieldType) {
            case 'POINT':
                if (geojson[0] && turf.getType(geojson[0]).toUpperCase() === 'POINT') {
                    return geojson[0]
                }

                break;
            case 'LINESTRING':
                if (geojson[0] && turf.getType(geojson[0]).toUpperCase() === 'LINESTRING') {
                    return geojson[0]
                }

                break;
            case 'POLYGON':
                if (geojson[0] && turf.getType(geojson[0]).toUpperCase() === 'POLYGON') {
                    return geojson[0]
                }

                break;
            default:
                break;
        }
        return {}
    }

    useEffect(() => {
        if (pgTables.spatialTables && contentTypeMatch) {
            let uid = contentTypeMatch.params.uid || ''
            if (pgTables.spatialTables[uid] && pgTables.spatialTables[uid][name]) {
                setRenderMap(true);
                setTableSettings(pgTables.spatialTables[uid][name])

            }
        }
    }, [pgTables, contentTypeMatch]);
    useEffect(() => {
        if (renderMap && tableSettings) {
            let map = L.map(`map_${name}`, {
                center: [135.082162,-27.702165],
                zoom: 22,
                maxZoom: 22,
                minZoom: 4,
                // pmIgnore: false
            });
            // let editLayer = L.layerGroup([],{id: 'inputData'}).addTo(map)


            let geojsonFeature;
            try {
                geojsonFeature = JSON.parse(value)
            } catch (error) {
                console.log('error parsing value')
                error = "error parsing value"
            }
            console.log(geojsonFeature,"json feature");
            let geojsonLayer = L.geoJSON(geojsonFeature, {
                id: 'inputData',
                pointToLayer: (geoJsonPoint, latlng) => {
                    return L.circleMarker(latlng);
                }
            }).addTo(map)
            function pointMap({detail}){
                geojsonLayer.clearLayers();
                L.circleMarker([detail.lat,detail.lng]).addTo(geojsonLayer)
                // geojsonLayer.addLayer({
                //     type:"Point",
                //     coordinates:[detail.lat,detail.lng]
                // })
                map.flyTo({
                    lat:detail.lat,
                    lng:detail.lng
                })
            }
            subscribe("map:selectItem",pointMap)
            let bounds = geojsonLayer.getBounds()
            if (bounds.isValid()) {
                map.fitBounds(bounds);
            }
            map.pm.setGlobalOptions({ layerGroup: geojsonLayer })




            // let mapDiv = document.getElementById("map");
            // let resizeObserver = new ResizeObserver(() => {
            //     map.invalidateSize();
            // });
            // resizeObserver.observe(mapDiv);

            let osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            let osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors';
            let osm = L.tileLayer(osmUrl, { attribution: osmAttrib }).addTo(map);
            // L.control.layers({
            //     'OSM': osm.addTo(map),
            //     "Google": L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
            //         attribution: 'google'
            //     })
            // }, undefined, { position: 'topright', collapsed: false }).addTo(map);

            if (!disabled) {
                let pmSettings = {
                    position: 'topleft',
                    drawCircle: false,
                    drawMarker: false,
                    drawCircleMarker: false,
                    drawPolyline: false,
                    drawText: false,
                    drawRectangle: false,
                    drawPolygon: false,
                    editControls: false,
                    drawControls: true,
                    cutPolygon: false,
                    rotateMode: false,
                    removalMode: false,
                }

                //its draw mode
                pmSettings['editControls'] = true;
                switch (tableSettings['geoType']) {
                    case 'POINT':
                        pmSettings['drawCircleMarker'] = true;
                        pmSettings['isMluti'] = false;
                        break;
                    case 'LINESTRING':
                        pmSettings['drawPolyline'] = true;
                        pmSettings['isMluti'] = false;
                        break;
                    case 'POLYGON':
                        pmSettings['drawPolygon'] = true;
                        pmSettings['isMluti'] = false;
                        break;

                    default:
                        break;
                }


                if (!pmSettings['isMluti']) {
                    map.on('pm:drawstart', ({ workingLayer }) => {
                        map.eachLayer(function (layer) {
                            geojsonLayer.clearLayers()
                        });
                    });

                    map.on('pm:create', ({ shape, layer }) => {
                        map.pm.disableDraw();
                    });
                }

                geojsonLayer.on('layeradd', () => {
                    let sanitized = sanitizeGeojson(geojsonLayer.toGeoJSON(), tableSettings['geoType'])
                    value = JSON.stringify(sanitized);
                    console.log(value);
                    // Update the parent
                    onChange({
                        target: {
                            name,
                            value,
                            type: 'json',
                        },
                    });
                })
                geojsonLayer.on('layerremove', () => {
                    let sanitized = sanitizeGeojson(geojsonLayer.toGeoJSON(), tableSettings['geoType'])
                    value = JSON.stringify(sanitized);
                    onChange({
                        target: {
                            name,
                            value,
                            type: 'json',
                        },
                    });
                })

                geojsonLayer.on('pm:change', () => {
                    let sanitized = sanitizeGeojson(geojsonLayer.toGeoJSON(), tableSettings['geoType'])
                    value = JSON.stringify(sanitized);
                    onChange({
                        target: {
                            name,
                            value,
                            type: 'json',
                        },
                    });
                })
                map.pm.addControls(pmSettings);
            }
            return () => {
                map.remove(),
                unsubscribe("map:selectItem",pointMap)
            }
        }
    }, [renderMap, tableSettings])

    return (
        <>
            {renderMap ?
                <Stack size={1}>
                    <Box>
                        <Typography variant="pi" fontWeight="bold">
                            {formatMessage(intlLabel)}
                        </Typography>
                        {required &&
                            <Typography variant="pi" fontWeight="bold" textColor="danger600">*</Typography>
                        }
                    </Box>
                    {error &&
                        <Typography variant="pi" textColor="danger600">
                            {formatMessage({ id: error, defaultMessage: error })}
                        </Typography>
                    }
                    {description &&
                        <Typography variant="pi">
                            {formatMessage(description)}
                        </Typography>
                    }
                    <div ref={searchRef}>
                        <Searchbar
                            value={searchLocation}
                            name="searchbar"
                            clearLabel="Clearing the plugin search"
                            placeholder="search address"
                            size="S"
                            onClear={() => setSearchLocation("")}
                            onChange={e => setSearchLocation(e.target.value)} />
                    </div>
                    {searchVisible && < Popover source={searchRef} spacing={0}  >
                        <ul style={{ minWidth: '500px' }}>
                            {
                                searchItems.map((r,index) => {
                                    return (<Box color="neutral800" key={index} padding={4} as="li" onClick={()=>{
                                        publish("map:selectItem",r.location)
                                    }}>
                                            {r.address} 1231
                                    </Box>)
                                })
                            }
                        </ul>
                    </Popover>
                    }
                    <div id={`map_${name}`} style={{ height: "500px" }}></div>
                    < InputJSON name={`${name}- Geojson`} onChange={() => { }} value={value} disabled ></InputJSON>
                    <Button startIcon={<Landscape />} variant='secondary' fullWidth >View In the PG Page</Button>
                </Stack>
                : < InputJSON name={name} onChange={onChange} value={value} intlLabel={intlLabel} disabled={disabled} error={error} description={description} required={required} ></InputJSON>
            }
        </>
    );
};

Map.defaultProps = {
    description: '',
    disabled: false,
    error: undefined,
    intlLabel: '',
    required: false,
    value: '',
};

Map.propTypes = {
    description: PropTypes.shape({
        id: PropTypes.string,
        defaultMessage: PropTypes.string,
    }),
    disabled: PropTypes.bool,
    error: PropTypes.string,
    intlLabel: PropTypes.shape({
        id: PropTypes.string,
        defaultMessage: PropTypes.string,
    }),
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool,
    value: PropTypes.string,
};

export default Map;