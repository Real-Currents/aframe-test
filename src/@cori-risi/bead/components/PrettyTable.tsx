import style from "./styles/PrettyTable.module.css";

import { PrettyTableInput } from "../../utils/utils";

export interface PrettyTableProps {
    data: PrettyTableInput | undefined;
}

const PrettyTable: React.FC<PrettyTableProps> = ({ data }) => {
  return (
    data === undefined ? (
      <></>
    ) : (
      <div className={style["pretty-table"]}>
        <table>
          <tbody>
            {Object.entries(data).map(([key, value]) => (
              <tr key={key}>
                <th>{key}</th>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  );
}

export default PrettyTable;

