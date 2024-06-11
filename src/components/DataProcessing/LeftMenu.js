import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import TimelineIcon from '@mui/icons-material/Timeline';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import StorageIcon from '@mui/icons-material/Storage';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import PsychologyIcon from '@mui/icons-material/Psychology';
import WidgetsIcon from '@mui/icons-material/Widgets';
import DataSelectDialog from './dialogs/DataSelectDialog/DataSelectDialog';
import PreProcessingAlgDialog from './dialogs/PreProcessingAlgDialog/PreProcessingAlgDialog';
import LogoutIcon from '@mui/icons-material/Logout';
import SnippetFolderIcon from '@mui/icons-material/SnippetFolder';
import AIModels from './dialogs/AIModels/AIModels';
import KeyIcon from '@mui/icons-material/Key';
import ManageAPIKeys from './dialogs/ManageAPIKeys/ManageAPIKeys';
import GridViewIcon from '@mui/icons-material/GridView';
import toast, { Toaster } from 'react-hot-toast';
import { useSelector } from "react-redux/es/hooks/useSelector";
import AreYouSure from './dialogs/AreYouSure/AreYouSure';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme)=> ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});
 
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));



const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);
 
export default function MiniDrawer() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [selectDataDialog, setSelectDataDialog] = React.useState(false);
  const [preProcessingAlgDialogOpen, setPreProcessingAlgDialogOpen] = React.useState(false);
  const [displayMLModels, setDisplayMLModels] = React.useState(false);
  const [isDatasetSelected, setIsDatasetSelected] = React.useState(false);
  const [areYouSureOpen, setAreYouSureOpen] = React.useState(false);
  const [isManageKeysOpen, setIsManageKeysOpen] = React.useState(false);
  const dataset = useSelector((state)=>state.selectedDataset);

  const blockAlert = (msg)=>{
    toast.error(msg,{
      duration:2000,
      position:'top-right',
    })
  }

  const navigate = useNavigate();
  
  
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClick = () => {
    setSelectDataDialog(true);
  }

  const handleDataSelectDialogClose = ()=>{
    setSelectDataDialog(false);
  }

  const handlePreprocessingAlgDialogClose = ()=>{
      setPreProcessingAlgDialogOpen(false);
  }

  const handleDisplayMLModels = () =>{
    setDisplayMLModels(false);
  }
 
  const handleOpenMLModels = ()=>{
    if(isDatasetSelected){
      setDisplayMLModels(true);
    } else {
      blockAlert("Please select a dataset first!")
    }
  }

  const handleCloseAreYouSure = ()=>{
    setAreYouSureOpen(false);
  }

  const handleLogout = ()=>{
    localStorage.clear();
    navigate("/");
    
  }


  React.useEffect(()=>{
    if(dataset.length != 0){
      setIsDatasetSelected(true);
    } else {
      setIsDatasetSelected(false);
    }
  },[dataset])

  return (
    <Box sx={{ display: 'flex' , width:"20px !important"}}>
      <CssBaseline />
      <AppBar position="fixed" open={open} >
        <Toolbar sx={{ backgroundColor: '#262938' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
          AI Flow Forge
          </Typography>
        
          <div style={{ flex: 1 }} />
            <IconButton color="inherit" onClick={()=>{setAreYouSureOpen(true); }} aria-label="logout">
              <LogoutIcon />
             </IconButton>
        </Toolbar>
        
      </AppBar>
      <Drawer variant="permanent" open={open} PaperProps={{
        sx: {
          backgroundColor: "#32364a",
          color: "red",
        }
        }}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
             <ListItem key={"Select Dataset"} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    color:"white"
                  }}
                  key={0}
                  onClick={()=>{ handleClick();}}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                      color:"white"
                    }}
                  >
                   <StorageIcon/>
                  </ListItemIcon>
                  <ListItemText primary={"Select Dataset"} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
             
            </ListItem>

            <ListItem key={"Data pre-processing"} disablePadding sx={{ display: 'block' }} onClick={()=>{setPreProcessingAlgDialogOpen(true)}}>
              <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    color:"white"
                  }}
                  key={1}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                      color:"white"
                    }}
                  >
                   <FilterAltIcon/>
                  </ListItemIcon>
                  <ListItemText primary={"Data pre-processing"} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
            </ListItem>
            <ListItem key={"AI Models"} disablePadding sx={{ display: 'block' }} onClick={()=>{handleOpenMLModels()}}>
              <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    color:"white"
                  }}
                  key={2}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                      color:"white"
                    }}
                  >
                   <PsychologyIcon/>
                  </ListItemIcon>
                  <ListItemText primary={"AI Models"} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
            </ListItem>
        </List>
        <Divider />
        <List>
        <ListItem key={"My models"} disablePadding sx={{ display: 'block' }} onClick={()=>{navigate("/models")}}>
              <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    color:"white"
                  }}
                  key={4}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                      color:"white"
                    }}
                  >
                   <WidgetsIcon/>
                  </ListItemIcon>
                  <ListItemText primary={"My Models"} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
            </ListItem>
            <ListItem key={"Saved Pipelines"} disablePadding sx={{ display: 'block' }} onClick={()=>{navigate("/saved-pipelines")}}>
              <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    color:"white"
                  }}
                  key={4}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                      color:"white"
                    }}
                  >
                   <TimelineIcon/>
                  </ListItemIcon>
                  <ListItemText primary={"Saved Pipelines"} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
            </ListItem>
            <ListItem key={"Generate pipelines"} disablePadding sx={{ display: 'block' }} onClick={()=>{navigate("/generate-pipeline")}}>
              <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    color:"white"
                  }}
                  key={4}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                      color:"white"
                    }}
                  >
                   <TipsAndUpdatesIcon/>
                  </ListItemIcon>
                  <ListItemText primary={"Generate pipelines"} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
            </ListItem>
            <ListItem key={"Manage Datasets"} disablePadding sx={{ display: 'block' }} onClick={()=>{navigate("/dataset-manager")}}>
              <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    color:"white"
                  }}
                  key={4} 
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                      color:"white"
                    }}
                  >
                   <SnippetFolderIcon/>
                  </ListItemIcon>
                  <ListItemText primary={"Manage Datasets"} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
            </ListItem>
            <ListItem key={"Manage API Keys"} disablePadding sx={{ display: 'block' }} onClick={()=>{setIsManageKeysOpen(true)}}>
              <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    color:"white"
                  }}
                  key={4} 
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                      color:"white"
                    }}
                  >
                   <KeyIcon/>
                  </ListItemIcon>
                  <ListItemText primary={"Manage API Keys"} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
            </ListItem>
       
        </List>
      </Drawer>
      <Toaster/>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      </Box>
     {selectDataDialog && <DataSelectDialog  open={selectDataDialog} handleClose={handleDataSelectDialogClose} />}
     {preProcessingAlgDialogOpen && <PreProcessingAlgDialog open={preProcessingAlgDialogOpen} handleClose={handlePreprocessingAlgDialogClose} />}
     {displayMLModels && <AIModels open={displayMLModels} handleClose={handleDisplayMLModels} />}
     {areYouSureOpen && <AreYouSure noAction={()=>{}}  yesAction={()=>{handleLogout()}} alertDialogTitle={"Logout"} open={areYouSureOpen}  dialogMessage={"Do you want to sign out?"} handleClose={handleCloseAreYouSure}/>}
     {isManageKeysOpen && <ManageAPIKeys open={isManageKeysOpen} handleClose={()=>{setIsManageKeysOpen(false)}} /> }
    </Box>
  );
}