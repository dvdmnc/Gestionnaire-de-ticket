import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    Typography,
    Box,
    Avatar,
    Chip,
    Button,
    IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Column {
    id: string;
    label: string;
    minWidth?: number;
    align?: 'right' | 'left' | 'center';
    format?: (value: any) => React.ReactNode;
}

interface DataTableProps {
    title?: string;
    data: any[];
    columns: Column[];
    primaryKey: string;
    onEdit?: (item: any) => void;
    onDelete?: (id: any) => void;
    onView?: (item: any) => void;
    avatarField?: string;
    chipField?: string;
    chipConfig?: {
        getValue: (item: any) => string;
        getColor: (value: string) => { bg: string; text: string };
    };
    actions?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
                                                 title,
                                                 data,
                                                 columns,
                                                 primaryKey,
                                                 onEdit,
                                                 onDelete,
                                                 onView,
                                                 avatarField,
                                                 chipField,
                                                 chipConfig,
                                                 actions = true
                                             }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Function to get initials from a string (name)
    const getInitials = (text: string) => {
        if (!text) return "--";
        return text
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    // Function to render cell content based on column configuration
    const renderCellContent = (item: any, column: Column) => {
        const value = item[column.id];

        // If this column has a custom format function, use it
        if (column.format) {
            return column.format(value);
        }

        // If this is the avatar field
        if (avatarField && column.id === avatarField) {
            return (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                        sx={{
                            bgcolor: '#3f51b5',
                            width: 36,
                            height: 36,
                            mr: 2,
                            fontSize: '0.9rem'
                        }}
                    >
                        {getInitials(value)}
                    </Avatar>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {value}
                    </Typography>
                </Box>
            );
        }

        // If this is the chip field
        if (chipField && column.id === chipField && chipConfig) {
            const chipValue = chipConfig.getValue(item);
            const { bg, text } = chipConfig.getColor(chipValue);
            return (
                <Chip
                    label={chipValue}
                    size="small"
                    sx={{
                        backgroundColor: bg,
                        color: text,
                        fontWeight: 500,
                        borderRadius: '6px'
                    }}
                />
            );
        }

        // Default display for values
        return value !== undefined && value !== null ? String(value) : "-";
    };

    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                overflow: 'hidden',
                borderRadius: '12px',
                border: '1px solid #e0e0e0',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)'
            }}
        >
            {title && (
                <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#232323' }}>
                        {title}
                    </Typography>
                </Box>
            )}
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align || 'left'}
                                    style={{ minWidth: column.minWidth }}
                                    sx={{ fontWeight: 600, color: '#3f51b5', backgroundColor: '#f5f7ff' }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                            {actions && (onEdit || onDelete || onView) && (
                                <TableCell
                                    sx={{ fontWeight: 600, color: '#3f51b5', backgroundColor: '#f5f7ff' }}
                                >
                                    Actions
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((item) => (
                                <TableRow
                                    key={item[primaryKey]}
                                    hover
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': { backgroundColor: '#f8f9ff' },
                                        transition: 'background-color 0.2s ease'
                                    }}
                                >
                                    {columns.map((column) => (
                                        <TableCell key={column.id} align={column.align || 'left'}>
                                            {renderCellContent(item, column)}
                                        </TableCell>
                                    ))}
                                    {actions && (onEdit || onDelete || onView) && (
                                        <TableCell>
                                            {onView && (
                                                <Button
                                                    variant="text"
                                                    onClick={() => onView(item)}
                                                    sx={{
                                                        mr: 1,
                                                        color: '#3f51b5',
                                                        textTransform: 'none',
                                                        fontWeight: 500,
                                                        minWidth: 'auto'
                                                    }}
                                                >
                                                    View
                                                </Button>
                                            )}
                                            {onEdit && (
                                                <IconButton
                                                    onClick={() => onEdit(item)}
                                                    sx={{
                                                        mr: 1,
                                                        color: '#3f51b5',
                                                        border: '1px solid #e0e0e0',
                                                        p: '6px',
                                                        '&:hover': { backgroundColor: 'rgba(63, 81, 181, 0.08)' }
                                                    }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                            {onDelete && (
                                                <IconButton
                                                    onClick={() => onDelete(item[primaryKey])}
                                                    sx={{
                                                        color: '#f44336',
                                                        border: '1px solid #e0e0e0',
                                                        p: '6px',
                                                        '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.08)' }
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        {data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={columns.length + (actions ? 1 : 0)} align="center" sx={{ py: 4 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        No data available
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                    borderTop: '1px solid #e0e0e0',
                    '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                        color: '#555555'
                    },
                    '.MuiButtonBase-root': {
                        color: '#3f51b5'
                    }
                }}
            />
        </Paper>
    );
};

export default DataTable;