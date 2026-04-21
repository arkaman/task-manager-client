import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react";

export function InputInline({
    value,
    onChange,
    onSearch,
}: {
    value: string;
    onChange: (v: string) => void;
    onSearch: () => void;
}) {
    return (
        <Field orientation="horizontal">
            <Input
                type="search"
                placeholder="Search Tasks..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") onSearch();
                }}
            />
            <Button onClick={onSearch}>
                <Search />
            </Button>
        </Field>
    );
}