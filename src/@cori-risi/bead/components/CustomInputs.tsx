import Button, { ButtonProps }  from '@mui/material/Button';
import IconButton, { IconButtonProps }  from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';


export const CustomButton = styled(Button)<ButtonProps>(({ theme }) => ({
    '&:hover': {
        backgroundColor: "#ECF5EF",
    },
}));

export const CustomIconButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
    '&:hover': {
        backgroundColor: "#ECF5EF",
    },
}));