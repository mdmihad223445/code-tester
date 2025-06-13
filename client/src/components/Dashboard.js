import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Divider 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FolderIcon from '@mui/icons-material/Folder';
import AuthContext from '../context/AuthContext';

function Dashboard() {
  const [codeFiles, setCodeFiles] = useState([]);
  const [currentFolder, setCurrentFolder] = useState('/');
  const [folders, setFolders] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCodeFiles = async () => {
      try {
        const res = await axios.get('/code/folder' + currentFolder);
        setCodeFiles(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchFolders = async () => {
      try {
        const res = await axios.get('/code');
        const uniqueFolders = [...new Set(res.data.map(file => file.folder))];
        setFolders(uniqueFolders);
      } catch (err) {
        console.error(err);
      }
    };

    if (user) {
      fetchCodeFiles();
      fetchFolders();
    }
  }, [user, currentFolder]);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">My Code Files</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          component={Link}
          to="/code/new"
        >
          New File
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 3 }}>
        <Card sx={{ minWidth: 250 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Folders
            </Typography>
            <List>
              <ListItem 
                button 
                selected={currentFolder === '/'}
                onClick={() => setCurrentFolder('/')}
              >
                <FolderIcon sx={{ mr: 1 }} />
                <ListItemText primary="Root" />
              </ListItem>
              <Divider />
              {folders
                .filter(f => f !== '/')
                .map((folder) => (
                  <ListItem 
                    key={folder} 
                    button 
                    selected={currentFolder === folder}
                    onClick={() => setCurrentFolder(folder)}
                  >
                    <FolderIcon sx={{ mr: 1 }} />
                    <ListItemText primary={folder} />
                  </ListItem>
                ))}
            </List>
          </CardContent>
        </Card>

        <Box sx={{ flexGrow: 1 }}>
          {codeFiles.length === 0 ? (
            <Typography>No files in this folder</Typography>
          ) : (
            codeFiles.map((file) => (
              <Card key={file._id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" component={Link} to={`/code/${file._id}`}>
                    {file.filename}
                  </Typography>
                  <Typography color="text.secondary">
                    {file.language.toUpperCase()} • {new Date(file.updatedAt).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
