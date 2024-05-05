import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";

const EditAddressDialog = ({ open, onClose, onSave, editData = {}, handleChange }: any) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Address</DialogTitle>
            <DialogContent>
            <TextField
                    autoFocus
                    margin="dense"
                    id="street"
                    label="Street"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={editData.street || ''}
                    onChange={handleChange('street')}
                />
                <TextField
                    margin="dense"
                    id="house_number"
                    label="House Number"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={editData.house_number || ''}
                    onChange={handleChange('house_number')}
                />
                <TextField
                    margin="dense"
                    id="city"
                    label="City"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={editData.city || ''}
                    onChange={handleChange('city')}
                />
                <TextField
                    margin="dense"
                    id="state"
                    label="State"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={editData.state || ''}
                    onChange={handleChange('state')}
                />
                <TextField
                    margin="dense"
                    id="postal_code"
                    label="Postal Code"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={editData.postal_code || ''}
                    onChange={handleChange('postal_code')}
                />
                <TextField
                    margin="dense"
                    id="country"
                    label="Country"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={editData.country || ''}
                    onChange={handleChange('country')}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditAddressDialog;
