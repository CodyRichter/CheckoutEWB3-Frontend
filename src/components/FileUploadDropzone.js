import React from 'react'
import { useDropzone } from 'react-dropzone'
import { Grid, IconButton, Paper, Typography } from '@mui/material'
import { CloudUpload, Delete } from '@mui/icons-material';
import { isEmpty } from 'lodash';


export default function FileUploadDropzone({ image, setImage }) {
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: acceptedFiles => {
            if (acceptedFiles.length > 0) {
                setImage(acceptedFiles[0]);
            }
        },
        accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    });
    const { ref, ...rootProps } = getRootProps();

    return (
        <>
            <Paper {...rootProps} ref={ref} elevation={4} className='p-2'>
                <input {...getInputProps()} />
                <Grid container direction='column' alignItems='center' justifyContent='center'>
                    <Grid item xs={12}>
                        <CloudUpload fontSize='large' />
                    </Grid>
                    <Grid item xs={12}>
                        {isEmpty(image) ? (
                            <Typography variant='h6'>Drag & Drop or Click to Upload Image</Typography>
                        ) : (
                            <Typography variant='h6'>Drag & Drop or Click to Replace Image</Typography>
                        )}
                    </Grid>
                </Grid>
            </Paper>

            {image && (
                <Grid container direction='row' alignItems='center' justifyContent='space-between' className='mt-2 p-1' component={Paper} elevation={4}>
                    <Grid item xs={10}>
                        <Typography variant='h6' component='span' className='ml-2'>Image Selected: &nbsp;</Typography>
                        <Typography variant='body1' component='span'>{image.name}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton onClick={() => setImage(null)} size="large"> <Delete color='error' /> </IconButton>
                    </Grid>

                </Grid>
            )}
        </>
    )
}