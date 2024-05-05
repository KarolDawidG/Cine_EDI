import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";

const EditUserDialog = ({ open, onClose, onSave, editData, handleChange }:any) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit User Data</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="first_name"
                    label="First Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={editData.first_name}
                    onChange={handleChange('first_name')}
                />
                <TextField
                    margin="dense"
                    id="second_name"
                    label="Second Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={editData.second_name}
                    onChange={handleChange('second_name')}
                />
                <TextField
                    margin="dense"
                    id="email"
                    label="Email"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={editData.email}
                    onChange={handleChange('email')}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditUserDialog;
