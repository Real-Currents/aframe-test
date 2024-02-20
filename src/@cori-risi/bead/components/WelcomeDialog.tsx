import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import style from "./styles/WelcomeDialog.module.css";

export default function WelcomeModal() {

	const [open, setOpen] = useState(true);
	const handleOpen = () => setOpen(true);
  	const handleClose = () => setOpen(false);

	return (
		<Dialog
		  open={open}
		  onClose={handleClose}
		  aria-labelledby="modal-modal-title"
		  aria-describedby="modal-modal-description"
		  BackdropProps={{style: {backgroundColor: 'rgba(255, 255, 255, 0.4)'}}}
		>
			<DialogTitle id={style["welcome-dialog-title"]}>
	          {"Welcome to the Rural Broadband Map"}
	        </DialogTitle>
		  	<DialogContent dividers>
				<p>
					Before using our map, here are some things to keep in mind:
				</p>
				<p className={style["info-chunk"]}>
					<b>Data is displayed at the census block level</b><br/>
					Due to the granularity of the data, you'll need to zoom in to a town or county to view
					estimates.
				</p>
				<p className={style["info-chunk"]}>
					<b>You can filter census blocks using the sidebar</b><br/>
					Use the controls on the right to focus on specific areas.
				</p>
				<p className={style["info-chunk"]}>
					<b>Click on a block to view detailed information</b><br/>
					Broadband technology, funding, and demographic data will be displayed in a window.
				</p>
	        </DialogContent>
	        <DialogActions>
	          <Button autoFocus onClick={handleClose} variant="contained">
	            OK
	          </Button>
	        </DialogActions>
		</Dialog>
	);
}
