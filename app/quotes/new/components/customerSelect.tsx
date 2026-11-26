import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

import { Customer } from "../../../types/customer";

interface CustomerSelectProps {
  customers: Customer[];
  customerId: number | "";
  onChange: (customerId: number) => void;
}

export function CustomerSelect({
  customers,
  customerId,
  onChange,
}: CustomerSelectProps) {
  return (
    <FormControl fullWidth sx={{ mt: 2 }}>
      <InputLabel id="customer-label">Cliente</InputLabel>

      <Select
        labelId="customer-label"
        value={customerId}
        label="Cliente"
        onChange={(event) => onChange(Number(event.target.value))}
      >
        {customers.map((customer) => (
          <MenuItem key={customer.id} value={customer.id}>
            {customer.razonSocial}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
