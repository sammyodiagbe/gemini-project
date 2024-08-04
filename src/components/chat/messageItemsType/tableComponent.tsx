import { FC } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ComponentType = {
  data: { rows: string[][]; headers: string[]; title: string };
};
const TableComponent: FC<ComponentType> = ({ data }) => {
  const { rows, headers, title } = data;

  return (
    <div className="">
      <Table className="w-full">
        <TableCaption>{title}</TableCaption>
        <TableHeader>
          <TableRow>
            {headers.map((header, index) => {
              return <TableHead key={index}> {header}</TableHead>;
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => {
            return (
              <TableRow key={index}>
                {row.map((entry, ind) => {
                  return <TableCell key={ind}>{entry}</TableCell>;
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableComponent;
