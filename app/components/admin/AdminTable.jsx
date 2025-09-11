import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function AdminTable({ columns, data, onRowClick }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map(col => (
            <TableHead key={col.key}>{col.label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, i) => (
          <TableRow
            key={i}
            className={onRowClick ? "cursor-pointer hover:bg-gray-100" : ""}
            onClick={() => onRowClick?.(row)}
          >
            {columns.map(col => (
              <TableCell key={col.key}>
                {col.key === "dateTime" && row.dateTime?.toDate
                  ? row.dateTime.toDate().toLocaleString()
                  : row[col.key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
