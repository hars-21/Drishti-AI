import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useEffect, useState } from "react";

interface OverpassGeometry {
	lon: number;
	lat: number;
}

interface OverpassElement {
	geometry?: OverpassGeometry[];
}

interface GeoJSONData {
	type: "FeatureCollection";
	features: Array<{
		type: "Feature";
		geometry: {
			type: "LineString";
			coordinates: [number, number][];
		};
	}>;
}

export default function Map() {
	const [railways, setRailways] = useState<GeoJSONData | null>(null);

	useEffect(() => {
		const query = `
      [out:json][timeout:1800];
      area["name"="India"]->.india;
      way["railway"="rail"](area.india);
      out geom;
    `;

		fetch("https://overpass-api.de/api/interpreter", {
			method: "POST",
			body: query,
		})
			.then((res) => res.json())
			.then((data) => {
				const geojson: GeoJSONData = {
					type: "FeatureCollection",
					features: data.elements
						.filter((el: OverpassElement) => el.geometry)
						.map((el: OverpassElement) => ({
							type: "Feature" as const,
							geometry: {
								type: "LineString" as const,
								coordinates: el.geometry!.map((p: OverpassGeometry) => [p.lon, p.lat] as [number, number]),
							},
						})),
				};
				setRailways(geojson);
			});
	}, []);

	return (
		<MapContainer center={[22.59, 78.96]} zoom={5} style={{ height: "100vh", width: "100%" }}>
			<TileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				attribution="© OpenStreetMap"
			/>

			{railways && (
				<GeoJSON
					data={railways}
					style={{
						color: "#d32f2f",
						weight: 1,
					}}
				/>
			)}
		</MapContainer>
	);
}
