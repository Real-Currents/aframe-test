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
					<b>Data is displayed at the Census Block level</b><br/>
					Due to the granularity of the data, you'll need to zoom into a single county
					to view aggregated <a href="https://broadbandmap.fcc.gov/data-download/nationwide-data" target="_blank">
					Broadband data</a> per-block, as well as other info for a selection of blocks.
				</p>
				<p className={style["info-chunk"]}>
					<b>Broadband service level terms and criteria used here are defined by the Broadband Equity, Access, and Deployment (BEAD) program</b><br/>
					Click <a href="https://broadbandusa.ntia.doc.gov/funding-programs/broadband-equity-access-and-deployment-bead-program" target="_blank">here</a> to learn more about BEAD.
				</p>
				<p className={style["info-chunk"]}>
					<b>You can filter Census Blocks using the sidebar</b><br/>
					Use the controls on the right to focus on specific areas.
				</p>
				<p className={style["info-chunk"]}>
					<b>Click on areas of interest to view detailed information</b><br/>
					Broadband technology, funding, and demographic data for the selected Census block(s) are
					displayed in a seperate panel.
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
