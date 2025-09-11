import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function TypeFilter({ value, onChange }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Filtrar por tipo" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todas</SelectItem>
        <SelectItem value="pilates">Pilates</SelectItem>
        <SelectItem value="yoga">Yoga</SelectItem>
        <SelectItem value="barre">Barre</SelectItem>
        <SelectItem value="funcional">Funcional</SelectItem>
      </SelectContent>
    </Select>
  );
}
