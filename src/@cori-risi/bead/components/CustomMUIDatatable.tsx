import React from "react";
import { Checkbox, Chip, Fade, Radio } from "@mui/material";
import MuiTooltip from "@mui/material/Tooltip";
import MUIDataTable, {
    TableFilterList, TableViewCol
} from "mui-datatables";


const dt_columns = [
    "Name",
    "Company",
    "City",
    "State"
];

const dt_data = [
    ["Joe James", "Test Corp", "Yonkers", "NY"],
    ["John Walsh", "Test Corp", "Hartford", "CT"],
    ["Bob Herm", "Test Corp", "Tampa", "FL"],
    ["James Houston", "Test Corp", "Dallas", "TX"],
];

const CustomChip = (props) => {
    const { label, onDelete, columnNames, className, index } = props;
    return (<Chip
        className={className}
        variant="outlined"
        color={columnNames[index].name === 'Company' ? 'secondary' : 'primary'}
        label={label}
        onDelete={onDelete}
    />);
};

const CustomTooltip = (props) => {
    return (
        <MuiTooltip
            title={props.title}
            disableInteractive={false}
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 250 }}
            leaveDelay={250}>{props.children}</MuiTooltip>
    );
};

const CustomCheckbox = (props) => {
    let newProps = Object.assign({}, props);
    newProps.color = props['data-description'] === 'row-select' ? 'secondary' : 'primary';

    if (props['data-description'] === 'row-select') {
        return (<Radio {...newProps} />);
    } else {
        return (<Checkbox {...newProps} />);
    }
};

const CustomFilterList = (props) => {
    return <TableFilterList {...props} ItemComponent={CustomChip} />;
};

export function CustomMUIDatatable (props) {
    console.log(props);

    return (
        <MUIDataTable
            title={ props.title || "Employee List" }
            columns={ props.columns || dt_columns }
            components={{
                TableFilterList: CustomFilterList,
                Tooltip: CustomTooltip,
                Checkbox: CustomCheckbox,
                TableViewCol: TableViewCol
            }}
            data={ dt_data }
            options={{
                "filterType": "checkbox"
            }}
        />
    );
}
