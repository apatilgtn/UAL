variable "storage_container_name" {
  description = "Custom name for the Storage Container. If not set, a default name will be used."
  type        = string
  default     = null
}

variable "storage_table_name" {
  description = "Custom name for the Storage Table. If not set, a default name will be used."
  type        = string
  default     = null
}
variable "storage_account_name" {
  description = "Custom name for the Storage Account. If not set, a default name will be generated."
  type        = string
  default     = null
}
