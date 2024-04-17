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
		  container={() => document.getElementById('overlay')}
		  open={open}
		  onClose={handleClose}
		  aria-labelledby="modal-modal-title"
		  aria-describedby="modal-modal-description"
		  BackdropProps={{style: {backgroundColor: 'rgba(255, 255, 255, 0.4)'}}}
		>
			<DialogTitle id={style["welcome-dialog-title"]}>
	          {"Welcome to the Interactive Rural Broadband Map"}
	        </DialogTitle>
		  	<DialogContent dividers>
				<p className={style["info-chunk"]}>
					<b>Data is displayed at the census block level.</b> Zoom in to a county to see 
					granular <a href="https://broadbandmap.fcc.gov/data-download/nationwide-data?version=jun2023" target="_blank">broadband</a> and other data for a single or multiple blocks.
				</p>
				<p className={style["info-chunk"]}>
					<b>The BEAD service level terms and criteria are defined by the Broadband Equity, Access, and Deployment (BEAD) program.</b> Click <a href="https://broadbandusa.ntia.doc.gov/funding-programs/broadband-equity-access-and-deployment-bead-program" target="_blank">here</a> to learn more.
				</p>
				<p className={style["info-chunk"]}>
					<b>Click the "show filters" button</b> on the header bar to filter census blocks by ISP, technology presence, and BEAD eligibility.<br/>
				</p>
				<p className={style["info-chunk"]}>
					<b>Select a block and click the "display info" button</b> to display a panel with detailed information.<br/>
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
