import GeoJSONFeature from "maplibre-gl";

interface PrettyTableProps {
    data: GeoJSONFeature
}

const PrettyTable: React.FC < PrettyTableProps > = (data) => {
    return (
        <div>
            <p>A pretty table will go here</p>
        </div>
    );
}

export default PrettyTable;
