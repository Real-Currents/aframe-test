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
					<ul className={style["dialog-list"]}>
						<li>The United States is big</li>
						<li>New Hampshire is the best state</li>
						<li>Biscuits are known as crumpets in the UK</li>
					</ul>
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
