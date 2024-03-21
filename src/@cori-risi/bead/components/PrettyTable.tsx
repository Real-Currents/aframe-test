import style from "./styles/PrettyTable.module.css";
import { PrettyTableInput } from "../../types";

export interface PrettyTableProps {
    data: PrettyTableInput | undefined;
    title: string
}

const key_name_lookup: Record<string, string> = {
  "cnt_total_locations": "Total locations",
  "cnt_100_20": "Locations with 100/20 Mbps service",
  "cnt_25_3": "Locations with 25/3 Mbps service",
  "has_previous_funding": "Previous federal funding?"
}

const PrettyTable: React.FC<PrettyTableProps> = ({ data, title, subtitle }) => {

  const renderValue = (value: any) => {

    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    return value;
  };

  const renderKey = (key: any) => {

    if (typeof key === 'string' && key_name_lookup.hasOwnProperty(key)) {
      return key_name_lookup[key];
    }
    else {
      return key;
    }

  }

  return (
    data === undefined ? (
      <></>
    ) : (
      <div className={style["pretty-table"]}>
        <h4>{title}</h4>
        <p className={style["subtitle"]}>{subtitle}</p>
        <table>
          <tbody>
            {Object.entries(data).map(([key, value]) => (
              <tr key={key}>
                <th>{renderKey(key)}</th>
                <td>{renderValue(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  );
}

export default PrettyTable;

