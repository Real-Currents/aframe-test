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
	          {"Welcome to the Interactive Rural Broadband Map"}
	        </DialogTitle>
		  	<DialogContent dividers>
				<p>
					Important context about this tool:
				</p>
				<p className={style["info-chunk"]}>
					<b>Data is displayed at the census block level.</b><br/>
					Due to the granularity of the data, you'll need to zoom into a single county to view 
					aggregated <a href="https://broadbandmap.fcc.gov/data-download/nationwide-data?version=jun2023" target="_blank">broadband data</a> per 
					block, as well as other info for a selection of blocks.
				</p>
				<p className={style["info-chunk"]}>
					<b>The broadband service level terms and criteria used here are defined by the Broadband Equity, Access, and Deployment (BEAD) program.</b><br/>
					Click <a href="https://broadbandusa.ntia.doc.gov/funding-programs/broadband-equity-access-and-deployment-bead-program" target="_blank">here</a> to learn more about BEAD.
				</p>
				<p className={style["info-chunk"]}>
					<b>Users can filter census blocks by ISP, technology presence, and BEAD eligibility, using the controls on the sidebar.</b><br/>
				</p>
				<p className={style["info-chunk"]}>
					<b>Click on areas of interest to view detailed information.</b><br/>
					Broadband technology, funding, and demographic data for the selected census block(s) are displayed in a separate panel.
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
